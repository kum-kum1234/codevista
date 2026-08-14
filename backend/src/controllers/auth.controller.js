const { authService } = require("../services");

const register = async (req, res) => {
  try {
    const { verificationToken, ...userBody } = req.body;
    const user = await authService.createUser(userBody, verificationToken);
    const tokens = await authService.generateAuthTokens(user);
    res
      .status(201)
      .send({ success: true, data: user, tokens: tokens });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.loginUserWithEmailAndPassword(
      email,
      password,
    );
    const tokens = await authService.generateAuthTokens(user);
    res
      .status(200)
      .send({ success: true, data: user, tokens: tokens });
  } catch (error) {
    console.log("=================", error);
    res.status(401).send({ success: false, message: error.message });
  }
};

const sendOtp = async (req, res) => {
  try {
    const { email, phone, type } = req.body;
    const result = await authService.sendOtp(email, phone, type);
    res.status(200).send({ success: true, data: result });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, phone, otp, type } = req.body;
    const result = await authService.verifyOtp(email, phone, otp, type);
    res.status(200).send({ success: true, data: result });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { tokenId } = req.body;
    const { user, isNewUser } = await authService.googleLogin(tokenId);
    const tokens = await authService.generateAuthTokens(user);
    res.status(200).send({ success: true, data: user, tokens, isNewUser });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await authService.getMe(req.user.id);
    res.status(200).send({ success: true, data: user });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  login,
  sendOtp,
  verifyOtp,
  googleLogin,
  getMe,
};