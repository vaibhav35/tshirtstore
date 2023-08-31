const BigPromise = require("../middlewares/bigPromise");

// const crypto=require('crypto')
exports.home = BigPromise(async (req, res) => {
  // const db = await something()
  res.status(200).json({
    success: true,
    greeting: "Hello from API",
  });
  // console.log(process.env)
  // crypto.pbkdf2('a','b',100000,512,'sha512',()=>{
  //   res.send('HI')
  // })

});

exports.homeDummy = async (req, res) => {
  try {
    // const db = await something()

    res.status(200).json({
      success: true,
      greeting: "this is another dummy route edit",
    });
  } catch (error) {
    console.log(error);
  }
};
