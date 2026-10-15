// SMS sending hook for the phone OTP login.
//
// No SMS provider is connected yet. Put your provider's call inside
// sendOtpSms (phone is a 10-digit Indian number, code is the 6-digit OTP).
// routes/auth.js calls only this function, so nothing else needs to change.
//
// Until then: in development the code is printed in the server console,
// and in production sending fails with an error (codes are never logged).

async function sendOtpSms(phone, code) {
  // TODO: call your SMS provider here, e.g.
  // await provider.send({ to: `91${phone}`, text: `${code} is your CodeVista login code.` });

  if (process.env.NODE_ENV === "production") {
    throw new Error("SMS provider is not configured");
  }

  console.log(`📱 [dev] OTP for ${phone}: ${code}`);
}

module.exports = { sendOtpSms };
