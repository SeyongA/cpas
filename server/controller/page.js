const axios = require('axios');

const main = (req, res) => {
  res.render('index');
};

const cart = (req, res) => {
  res.render('cart');
};

const map = (req, res) => {
  res.render('map');
};

const pay = (req, res) => {
  res.render('pay', { amount: 2500 });
};

const card = (req, res) => {
  res.render('card', {
    amount: 2500,
    email: req.params.id,
  });
};

const kakaopay = (req, res) => {
  const orderId = Date.now().toString();
  // 세션에 주문 정보 저장
  req.session.orderId = orderId;

  res.render('kakaopay', {
    productName: '주문 상품',
    orderId: orderId,
    amount: 2500,
    email: req.params.id,
    baseUrl: `http://localhost:${process.env.PORT || 8000}`,
    storeId: 'store-b515dc3a-a768-4a3c-b168-06475e6c1482',
    channelKey: 'channel-key-a9681283-166a-4775-b30b-bbb71729f9f7',
  });
};

const payS = (req, res) => {
  res.render('payS', {
    orderId: req.session.orderId,
  });
};

const paymentApproval = async (req, res) => {
  try {
    // 결제 승인 처리
    console.log('Payment approved:', req.session.orderId);
    res.redirect('/payment-success');
  } catch (error) {
    console.error('Payment approval error:', error);
    res.redirect('/payment/fail');
  }
};

const paymentFail = (req, res) => {
  res.render('paymentFail', {
    orderId: req.session.orderId,
  });
};

module.exports = {
  main,
  cart,
  map,
  pay,
  card,
  payS,
  kakaopay,
  paymentApproval,
  paymentFail,
};
