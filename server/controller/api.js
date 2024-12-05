const { Product } = require('../models');
const nodemailer = require('nodemailer');
const axios = require('axios');

const userEmail = async (req, res) => {
  try {
    // req.body에서 cartData 받기
    const { cartData } = req.body;

    // cartData validation 체크
    if (!cartData || typeof cartData !== 'object') {
      return res.status(400).json({
        message: '장바구니 데이터가 없거나 올바르지 않은 형식입니다.',
        received: req.body,
      });
    }

    // console.log('Received cartData:', cartData);

    // 각 상품에 대한 DB 조회 및 데이터 가공
    const productPromises = Object.keys(cartData).map(async (key) => {
      const product = await Product.findOne({
        where: { productId: key },
        attributes: ['productId', 'productName', 'price'],
      });

      if (product) {
        return {
          productId: product.productId,
          productName: product.productName,
          price: product.price,
          quantity: cartData[key].quantity,
          confidence: cartData[key].confidence,
        };
      }
      return null;
    });

    // Promise.all로 모든 상품 정보 조회 완료 대기
    const products = await Promise.all(productPromises);
    const validProducts = products.filter((product) => product !== null);

    // console.log('Sending products:', validProducts);

    // 성공 응답
    res.status(200).json({
      message: '상품 정보 조회 성공',
      products: validProducts,
    });
  } catch (error) {
    // 에러 로깅
    console.error('Error occurred:', error);

    // 데이터베이스 에러 처리
    if (error.name === 'SequelizeError') {
      return res.status(500).json({
        message: '데이터베이스 오류가 발생했습니다',
        error: error.message,
      });
    }

    // 기타 서버 에러 처리
    res.status(500).json({
      message: '서버 오류가 발생했습니다',
      error: error.message,
    });
  }
};

const sendMail = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(',,,,,', email);

    const { email_service, GMAIL, GPASS } = process.env;

    const transporter = nodemailer.createTransport({
      service: email_service,
      auth: {
        user: GMAIL,
        pass: GPASS,
      },
    });

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    </head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 0 auto; font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; background-color: #ffffff; border: 1px solid #dddddd;">
        <!-- 헤더 -->
        <div style="background-color: #1a73e8; color: white; padding: 20px; text-align: center;">
            <h2 style="margin: 0; font-size: 24px;">OO마트 전자영수증</h2>
        </div>

        <!-- 컨텐츠 -->
        <div style="padding: 30px 20px;">
            <p style="color: #333333; font-size: 16px; line-height: 1.6;">안녕하세요.</p>
            <p style="color: #333333; font-size: 16px; line-height: 1.6;">OO마트를 이용해 주셔서 감사합니다.</p>

            <!-- 주문 정보 -->
            <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 5px 0; font-size: 15px;">
                    <strong>주문 일시:</strong> ${new Date().toLocaleString('ko-KR')}
                </p>
                <p style="margin: 5px 0; font-size: 15px;">
                    <strong>주문 번호:</strong> ${Date.now().toString().slice(-8)}
                </p>
            </div>

            <!-- 상품 테이블 -->
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #e0e0e0;">
                <thead>
                    <tr style="background-color: #f5f5f5;">
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e0e0e0;">상품명</th>
                        <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e0e0e0;">수량</th>
                        <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e0e0e0;">단가</th>
                        <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e0e0e0;">금액</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">콜라</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: center;">1개</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: right;">1,500원</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: right;">1,500원</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">진라면</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: center;">1개</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: right;">1,000원</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: right;">1,000원</td>
                    </tr>
                </tbody>
            </table>

            <!-- 총액 -->
            <div style="text-align: right; padding: 20px; background-color: #f8f9fa; border-radius: 4px;">
                <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1a73e8;">
                    총 결제 금액: 2,500원
                </p>
            </div>

            <!-- 안내문구 -->
            <p style="margin-top: 30px; padding: 15px; background-color: #e8f0fe; color: #1a73e8; border-radius: 4px; font-size: 14px;">
                이 영수증은 전자영수증으로 발행되었으며, 소득공제용으로 사용 가능합니다.
            </p>
        </div>

        <!-- 푸터 -->
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dddddd;">
            <p style="margin: 5px 0; color: #666666; font-size: 13px;">본 메일은 발신전용이며 회신되지 않습니다.</p>
            <p style="margin: 5px 0; color: #666666; font-size: 13px;">© 2024 OO마트. All rights reserved.</p>
            <p style="margin: 5px 0; color: #666666; font-size: 13px;">주소: 서울특별시 OO구 OO로 123</p>
            <p style="margin: 5px 0; color: #666666; font-size: 13px;">고객센터: 1234-5678</p>
        </div>
    </div>
</body>
</html>
`;

    const mailOptions = {
      from: GMAIL,
      to: email,
      subject: 'OO마트 전자영수증이 발급되었습니다.',
      html: emailHtml,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.json({ result: false });
      } else {
        console.log('Email Sent', info);
        res.json({ result: true });
      }
    });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({
      result: false,
      message: '이메일 전송 중 오류가 발생했습니다',
    });
  }
};

module.exports = { userEmail, sendMail };
