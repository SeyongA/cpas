const { Product } = require("../models");
const axios = require('axios');

const userEmail = async (req, res) => {
 try {
   // req.body에서 cartData 받기 
   const { cartData } = req.body;

   // cartData validation 체크
   if (!cartData || typeof cartData !== 'object') {
     return res.status(400).json({
       message: '장바구니 데이터가 없거나 올바르지 않은 형식입니다.',
       received: req.body 
     });
   }

   console.log('Received cartData:', cartData);
   
   // 각 상품에 대한 DB 조회 및 데이터 가공
   const productPromises = Object.keys(cartData).map(async (key) => {
     const product = await Product.findOne({ 
       where: { productId: key },
       attributes: ['productId', 'productName', 'price']
     });
     
     if (product) {
       return {
         productId: product.productId,
         productName: product.productName,
         price: product.price,
         quantity: cartData[key].quantity,
         confidence: cartData[key].confidence
       };
     }
     return null;
   });

   // Promise.all로 모든 상품 정보 조회 완료 대기
   const products = await Promise.all(productPromises);
   const validProducts = products.filter(product => product !== null);

   console.log('Sending products:', validProducts);

   // 성공 응답
   res.status(200).json({
     message: '상품 정보 조회 성공',
     products: validProducts
   });

 } catch (error) {
   // 에러 로깅
   console.error('Error occurred:', error);

   // 데이터베이스 에러 처리
   if (error.name === 'SequelizeError') {
     return res.status(500).json({
       message: '데이터베이스 오류가 발생했습니다',
       error: error.message
     });
   }

   // 기타 서버 에러 처리
   res.status(500).json({
     message: '서버 오류가 발생했습니다',
     error: error.message
   });
 }
};

module.exports = { userEmail };