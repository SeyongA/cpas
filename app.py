import cv2
import torch
import sys
from flask import Flask, Response, jsonify, request
from flask_cors import CORS
import pathlib
from pathlib import Path
pathlib.PosixPath = pathlib.WindowsPath


# YOLOv5 경로 추가 (필요할 경우)
sys.path.append('./yolov5')

app = Flask(__name__)
CORS(app) 

# YOLOv5 사용자 정의 모델 로드 (best.pt 파일 경로 지정)
model = torch.hub.load('ultralytics/yolov5', 'custom', path='i416b48e50Smulti.pt')

carts = {}  # 클라이언트별 장바구니를 저장할 딕셔너리

def generate_frames(client_id):
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    if not cap.isOpened():
        print("웹캠을 열 수 없습니다.")

    while True:
        success, frame = cap.read()
        if not success:
            print("웹캠에서 영상을 받아올 수 없습니다.")
            break

        # YOLO 객체 탐지
        results = model(frame) 
        
        # 인식된 객체 정보 전송
        detected_objects = []
        for *box, conf, cls in results.xyxy[0]:
            if conf > 0.5:  
                detected_objects.append({'class': str(int(cls)), 'confidence': conf.item()})

        # 클라이언트의 장바구니에 상품 추가
        if client_id not in carts:
            carts[client_id] = {}

        for obj in detected_objects: 
            product_id = obj['class'] 
            if product_id in carts[client_id]: 
                # 이미 있는 경우 confidence 업데이트 
                carts[client_id][product_id]['confidence'] = max(
                    carts[client_id][product_id]['confidence'], 
                    obj['confidence']
                )
            else:
                # 새로 상품 추가
                carts[client_id][product_id] = {
                    'quantity': 1,
                    'confidence': obj['confidence']
                }

        # 프레임을 JPEG로 인코딩
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    cap.release()

@app.route('/video_feed/<client_id>')
def video_feed(client_id):
    return Response(generate_frames(client_id), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/cart/<client_id>', methods=['GET'])
def get_cart(client_id):
    # 클라이언트 ID가 존재하지 않으면 빈 딕셔너리 반환
    cart_data = carts.get(client_id, {})
    
    # 디버깅용 로그 추가
    print(f"Client ID: {client_id}")
    print(f"Cart Data: {cart_data}")
    
    return jsonify(cart_data)

if __name__ == '__main__':
    app.run(debug=True)
