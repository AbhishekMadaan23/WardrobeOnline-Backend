const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//REGISTER
router.get("/register", (req, res) => {
  console.log("register route working");
  res.send("hello world");
});

router.post("/register", async (req, res) => {
  console.log("post req received");

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  try {
    const savedUser = await newUser.save(); // because storing data in db takes some time and to prevent to flow to go to next line before that process is complete
    console.log(savedUser);
    res.status(201).json(savedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//LOGIN

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    !user && res.status(401).json("Wrong Credentials!");

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );

    const Originalpassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    Originalpassword !== req.body.password &&
      res.status(401).json("Wrong credentials!");

    const accessToken = jwt.sign(
      {
        //jwt web token for authentication
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC
      //{ expiresIn: "3d" } // after 3days we have to login again
    );

    const { password, ...others } = user._doc; // mongodb stores our info in ._doc folder
    res.status(200).json({ ...others, accessToken }); //after successful login we are sending user all the info like name but not password
  } catch (err) {
    res.status(500);
  }
});

module.exports = router; // exporting our router
