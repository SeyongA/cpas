import cv2
import torch
import sys
import mysql.connector
from flask import Flask, render_template, request, redirect, url_for, Response

# YOLOv5 경로 추가 (필요할 경우)
sys.path.append('./yolov5')

app = Flask(__name__)

# MySQL 연결 설정
db = mysql.connector.connect(
    host="localhost",
    user="root",        # MySQL 사용자
    password="root",    # MySQL 비밀번호
    database="mydatabase"  # 사용할 데이터베이스
)

# YOLOv5 사전 학습된 모델 로드
model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)

# 웹캠에서 프레임 생성 및 YOLO 객체 탐지 적용
def generate_frames():
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    if not cap.isOpened():
        print("웹캠을 열 수 없습니다.")  # 웹캠이 제대로 열리지 않는 경우 출력

    while True:
        success, frame = cap.read()
        if not success:
            print("웹캠에서 영상을 받아올 수 없습니다.")  # 프레임을 읽을 수 없을 경우 출력
            break

        # YOLO 객체 탐지
        results = model(frame)
        results.render()

        # 프레임을 JPEG로 인코딩
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    cap.release()

# 홈 페이지 (장바구니 데이터 조회)
def get_db_connection():
    if not db.is_connected():
        db.reconnect()
    return db.cursor()

@app.route('/')
def index():
    cursor = get_db_connection()  # MySQL 연결 확인 및 커서 생성
    cursor.execute("SELECT id, name, quantity, price FROM shopping_cart")  # 장바구니 테이블에서 데이터 가져오기
    items = cursor.fetchall()

    # 전체 가격 계산
    total_price = sum(item[2] * item[3] for item in items)

    return render_template('index.html', items=items, total_price=total_price)
# 상품 추가 기능
@app.route('/add_item', methods=['POST'])
def add_item():
    name = request.form['name']
    quantity = request.form['quantity']
    price = request.form['price']

    cursor = db.cursor()
    cursor.execute("INSERT INTO shopping_cart (name, quantity, price) VALUES (%s, %s, %s)", (name, quantity, price))
    db.commit()

    return redirect(url_for('index'))

# 상품 삭제 기능
@app.route('/delete_item/<int:item_id>')
def delete_item(item_id):
    cursor = db.cursor()
    cursor.execute("DELETE FROM shopping_cart WHERE id = %s", (item_id,))
    db.commit()

    return redirect(url_for('index'))

# 수량 수정 기능
@app.route('/update_quantity/<int:item_id>', methods=['POST'])
def update_quantity(item_id):
    new_quantity = request.form['quantity']

    cursor = db.cursor()
    cursor.execute("UPDATE shopping_cart SET quantity = %s WHERE id = %s", (new_quantity, item_id))
    db.commit()

    return redirect(url_for('index'))

# 웹캠 객체 인식 스트리밍 엔드포인트

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')



if __name__ == '__main__':
    app.run(debug=True)
