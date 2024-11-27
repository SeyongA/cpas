const cam = async (req, res) => {
  try {
    const { nickName } = req.query;
    console.log(nickName);
    const find = await User.findOne({ where: { nickName } });
 

    if (find) {
      res.json({ result: false, message: '이미 존재하는 닉네임' });
    } else {
      res.json({ result: true, message: '사용 가능한 닉네임' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ result: false, message: '서버오류' });
  }
};

module.exports = { cam }; 
