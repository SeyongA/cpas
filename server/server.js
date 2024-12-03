const express = require('express');
const cors = require('cors');
const db = require('./models');
const app = express();
const PORT = 8000;

app.use(cors());

app.set('view engine', 'ejs');

app.use(express.json());
app.use('/public', express.static(__dirname + '/public'));

// 라우터
const pageRouter = require('./routes/page');
app.use('/', pageRouter);

const apiRouter = require('./routes/api');
app.use('/api/cam', apiRouter);


db.sequelize.sync({ force: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
});
