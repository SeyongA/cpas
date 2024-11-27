const main = (req, res) => {
  res.render('index');
};

const cart = (req, res) => {
  res.render('cart');
};

const map = (req, res) => {
  res.render('map');
};
module.exports = { main, cart, map };
