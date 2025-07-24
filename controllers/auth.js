const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const { generateAccessToken } = require("../utils/token");

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required!!",
      });
    }
    if (!password) {
      return res.status(400).json({
        message: "Password is required!!",
      });
    }
    //check if user already exists
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (user) {
      return res.status(400).json({
        message: "User already exists!!",
      });
    }

    //hash password
    const hashPassword = await bcrypt.hash(password, 10);

    //create user
    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashPassword,
      },
    });

    res.send("register successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { firstName, email, password } = req.body;
    // check Email or FirstName
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { firstName: firstName }],
      },
    });

    if (!user || !user.enabled) {
      return res.status(400).json({
        message: "User not found or not Enabled !!",
      });
    }
    // check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Password Invalid!!",
      });
    }
    // create payload
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const token = generateAccessToken(payload);

    res.json({
      token,
      payload,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.currentUser = async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: req.user.email,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        role: true,
        picture:true,
      },
    });
    res.json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Oauth Google
exports.googleCallback = async (req, res) => {
  const token = generateAccessToken(req.user);
  res.redirect(`http://localhost:5173?token=${token}`);
};