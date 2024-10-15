from flask import Flask, render_template, request, redirect, url_for
import mysql.connector

app = Flask(__name__)

# MySQL 연결 설정
db = mysql.connector.connect(
    host="localhost",
    user="root",       # MySQL 사용자
    password="root",  # MySQL 비밀번호
    database="mydatabase"  # 사용할 데이터베이스
)

@app.route('/')
def index():
    cursor = db.cursor()
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

if __name__ == '__main__':
    app.run(debug=True)