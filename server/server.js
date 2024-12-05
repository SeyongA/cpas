const express = require('express');
const cors = require('cors');
const session = require('express-session'); // 추가
const db = require('./models');
const app = express();
const PORT = 8000;

// 세션 미들웨어 추가
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // 개발환경은 false
}));

app.use(cors({
  origin: 'http://127.0.0.1:5000',
  credentials: true
}));

app.set('view engine', 'ejs');

app.use(express.json());
app.use('/public', express.static(__dirname + '/public'));

const pageRouter = require('./routes/page');
app.use('/', pageRouter);

const apiRouter = require('./routes/api');
app.use('/api', apiRouter);

db.sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
});