const bcrypt = require("bcryptjs");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const otpGenerator = require("otp-generator");
const Otp = require("../models/otp.model");
const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateOTP = () => {
  return otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
};

const getOtpIdentifier = (email, phone, type) => {
  if (!['email', 'phone'].includes(type)) {
    throw new Error('OTP type must be email or phone');
  }

  const value = type === 'email' ? email : phone;
  if (!value || typeof value !== 'string') {
    throw new Error(`${type} is required`);
  }

  return type === 'email' ? value.trim().toLowerCase() : value.trim();
};

const getVerifiedRegistrationType = (verificationToken, userBody) => {
  if (!verificationToken) {
    throw new Error("OTP verification token is required");
  }

  let payload;
  try {
    payload = jwt.verify(verificationToken, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("OTP verification token is invalid or expired");
  }

  if (payload.type !== "OTP_REGISTRATION") {
    throw new Error("Invalid OTP verification token");
  }

  const identifier = getOtpIdentifier(userBody.email, userBody.phone, payload.identifierType);
  if (payload.sub !== identifier) {
    throw new Error("OTP verification token does not match the registration identifier");
  }

  return payload.identifierType;
};

const createUser = async (userBody, verificationToken) => {
  if (!userBody.name || !userBody.password) {
    throw new Error("Name and password are required");
  }

  const authProvider = getVerifiedRegistrationType(verificationToken, userBody);
  const identifier = getOtpIdentifier(userBody.email, userBody.phone, authProvider);
  const existingUser = await User.findOne({ [authProvider]: identifier });
  if (existingUser) {
    throw new Error(`${authProvider} already taken`);
  }

  return User.create({
    name: userBody.name.trim(),
    [authProvider]: identifier,
    password: await bcrypt.hash(userBody.password, 12),
    authProvider,
  });
};

const getUserByEmail = async (email) => {
  return User.findOne({ email: email.toLowerCase().trim() });
};

const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(
    90, // mintues
    "minutes",
  );
  const accessToken = generateToken(user.id, accessTokenExpires, "ACCESS");
  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
  };
};

const generateToken = (
  userId,
  expires,
  type,
  secret = process.env.JWT_SECRET,
) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

const loginUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) throw new Error("Email and password are required");
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Incorrect email or password");
  }
  if (!user.isActive) {
    throw new Error("Your account is inactive");
  }
  return user;
};

const sendOtp = async (email, phone, type) => {
  const identifier = getOtpIdentifier(email, phone, type);
  const otp = generateOTP();

  // Hash OTP before storing it
  const hashedOTP = await bcrypt.hash(otp, 10);

  // Remove previous OTP for this email/phone
  await Otp.deleteMany({
    identifier,
    type,
  });

  // OTP expires in 5 minutes
  await Otp.create({
    identifier,
    type,
    otp: hashedOTP,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  // For development only
  if (process.env.NODE_ENV !== "production") {
    console.log(`OTP for ${identifier}: ${otp}`);
  }

  // TODO:
  // if (type === "email") {
  //     send email here
  // }
  //
  // if (type === "phone") {
  //     send SMS here
  // }

  return {
    message: "OTP sent successfully",
    ...(process.env.NODE_ENV !== "production" && { otp }),
  };
};

const verifyOtp = async (email, phone, otp, type) => {
  const identifier = getOtpIdentifier(email, phone, type);
  if (!otp || typeof otp !== "string") {
    throw new Error("OTP is required");
  }

  const otpRecord = await Otp.findOne({
    identifier,
    type,
  });

  if (!otpRecord) {
    throw new Error("OTP not found or already used");
  }

  // Check expiry
  if (otpRecord.expiresAt < new Date()) {
    await Otp.deleteOne({ _id: otpRecord._id });

    throw new Error("OTP has expired");
  }

  // Compare entered OTP with hashed OTP
  const isValid = await bcrypt.compare(otp, otpRecord.otp);

  if (!isValid) {
    throw new Error("Invalid OTP");
  }

  // OTP can only be used once
  await Otp.deleteOne({
    _id: otpRecord._id,
  });

  const user = await User.findOne({ [type]: identifier });
  if (user) {
    if (!user.isActive) {
      throw new Error("Your account is inactive");
    }
    return {
      isNewUser: false,
      user,
      tokens: await generateAuthTokens(user),
    };
  }

  const registrationToken = jwt.sign(
    { sub: identifier, identifierType: type, type: "OTP_REGISTRATION" },
    process.env.JWT_SECRET,
    { expiresIn: "10m" },
  );

  return { isNewUser: true, registrationToken };
};

const googleLogin = async (tokenId) => {
  if (!tokenId) {
    throw new Error("Google ID token is required");
  }

  // Verify Google ID token
  const ticket = await googleClient.verifyIdToken({
    idToken: tokenId,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  const { email, name, email_verified } = payload;

  if (!email || !email_verified) {
    throw new Error("Google email is not verified");
  }

  // Check if user already exists
  let user = await User.findOne({
    email: email.toLowerCase(),
  });
  const isNewUser = !user;

  // Create new user
  if (!user) {
    user = await User.create({
      name: name || email.split("@")[0],
      email: email.toLowerCase(),
      authProvider: "google",
    });
  }

  // Check if account is active
  if (!user.isActive) {
    throw new Error("Your account is inactive");
  }

  return {
    user,
    isNewUser,
  };
};

const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

module.exports = {
  loginUserWithEmailAndPassword,
  generateAuthTokens,
  createUser,
  sendOtp,
  verifyOtp,
  googleLogin,
  getMe,
};
