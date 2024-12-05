const express = require('express');
const cors = require('cors');
const db = require('./models');
const app = express();
const PORT = 8000;

app.use(cors({
  origin: 'http://127.0.0.1:5000', // 플라스크 서버 주소
  credentials: true
}));

app.set('view engine', 'ejs');

app.use(express.json());
app.use('/public', express.static(__dirname + '/public'));

// 라우터
const pageRouter = require('./routes/page');
app.use('/', pageRouter);

const apiRouter = require('./routes/api');
app.use('/api', apiRouter);


db.sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
});
