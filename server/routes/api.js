const express = require('express');
const { userEmail, sendMail } = require('../controller/api'); 
const router = express.Router();
const axios = require('axios');

router.post('/data/:id', userEmail); 
router.post('/mail', sendMail); 
router.post('/payment/ready', async (req, res) => {
  try {
      const { email, amount, order_id } = req.body;

      const response = await axios({
          method: 'POST',
          url: 'https://kapi.kakao.com/v1/payment/ready',
          headers: {
              Authorization: 'KakaoAK 9878a71a895074c1a31032b1a381eab8',
              'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
          data: {
              cid: 'TC0ONETIME',
              partner_order_id: order_id,
              partner_user_id: email,
              item_name: '상품 주문',
              quantity: 1,
              total_amount: amount,
              tax_free_amount: 0,
              approval_url: 'http://localhost:8000/payment-success',
              cancel_url: 'http://localhost:8000/payment/cancel',
              fail_url: 'http://localhost:8000/payment/fail'
          }
      });

      // 세션에 결제 정보 저장
      req.session.tid = response.data.tid;
      req.session.order_id = order_id;
      req.session.email = email;

      res.json(response.data);
  } catch (error) {
      console.error('Payment ready error:', error.response?.data || error.message);
      res.status(500).json({ error: '결제 준비 중 오류가 발생했습니다.' });
  }
});

router.get('/payment/approval', async (req, res) => {
  try {
      const { pg_token } = req.query;

      const response = await axios({
          method: 'POST',
          url: 'https://kapi.kakao.com/v1/payment/approve',
          headers: {
              Authorization: 'KakaoAK 9878a71a895074c1a31032b1a381eab8',
              'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
          data: {
              cid: 'TC0ONETIME',
              tid: req.session.tid,
              partner_order_id: req.session.order_id,
              partner_user_id: req.session.email,
              pg_token: pg_token
          }
      });

      if (response.data.approved_at) {
          // 이메일 전송
          await axios.post('/api/mail', {
              email: req.session.email
          });
          
          res.redirect('/payment-success');
      }
  } catch (error) {
      console.error('Payment approval error:', error.response?.data || error.message);
      res.redirect('/payment/fail');
  }
});

module.exports = router;