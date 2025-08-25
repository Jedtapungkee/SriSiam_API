const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
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
      message: error.message || "Server Error",
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
        message: "User or Password Invalid!!",
      });
    }
    // check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "User or Password Invalid!!",
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
        picture: true,
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

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // check if user exists
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(400).json({
        message: "User not found!!",
      });
    }

    // RateLimitting 3 request per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
    const otpRequests = await prisma.resetPasswordToken.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: oneHourAgo,
        },
      },
    });
    if (otpRequests >= 3) {
      return res.status(429).json({
        message: "Too many requests. Please try again later.",
      });
    }
    // console.log("otpRequests", otpRequests);
    // console.log(oneHourAgo)

    // Cooldown
    const lastRequest = await prisma.resetPasswordToken.findFirst({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (lastRequest && Date.now() - lastRequest.createdAt < 60 * 1000) {
      return res.status(429).json({
        message: "Please wait 1 minute before requesting a new OTP.",
      });
    }
    // delete otp  
    await prisma.resetPasswordToken.deleteMany({
      where: {
        userId: user.id,
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    // generate otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // set expiration time
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // save otp to db
    await prisma.resetPasswordToken.create({
      data: {
        userId: user.id,
        otp,
        expiresAt,
      },
    });

    // send email
    await transporter.sendMail({
      to: email,
      subject: "Forgot Password Srisiam",
      html: `<h1>Forgot Password</h1>
           <p>Your OTP is ${otp}</p>
           <p>This OTP will expire at <b>${expiresAt.toLocaleString()}</b></p>`,
    });

    res.json({
      message: "OTP sent to your email",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // check if user exists
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(400).json({
        message: "User not found!!",
      });
    }

    // check if otp is valid
    const resetToken = await prisma.resetPasswordToken.findFirst({
      where: {
        userId: user.id,
        otp,
        expiresAt: {
          gte: new Date(),
        },
        used: false,
      },
    });
    if (!resetToken) {
      return res.status(400).json({
        message: "Invalid or expired OTP!!",
      });
    }

    // hash new password
    const hashPassword = await bcrypt.hash(newPassword, 10);

    // update user password
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashPassword,
      },
    });

    // update used otp
    await prisma.resetPasswordToken.update({
      where: {
        id: resetToken.id,
      },
      data: {
        used: true,
      },
    });

    res.json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
