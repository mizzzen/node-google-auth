const otplib = require('otplib');
const readline = require('readline');

let secrets;
try {
  secrets = require('./secrets');
} catch (e) {
  throw new Error('Please create secrets.json and add secrets');
}

if (Object.keys(secrets).length < 1) {
  throw new Error('Please add secrets to file (e.g. { "bybit": "SECRET_KEY" })');
}

const generateOTP = (secret) => {
  const token = otplib.authenticator.generate(secret);
  try {
    otplib.authenticator.check(token, secret);
  } catch (e) {
    return 'Invalid token'
  }
  return token;
};

const clearConsoleAndScrollbackBuffer = () => {
  const blank = '\n'.repeat(process.stdout.rows);
  console.log(blank);
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);
};

const showOTPs = () => {
  clearConsoleAndScrollbackBuffer();
  Object.keys(secrets).forEach((keyName) => {
    const token = generateOTP(secrets[keyName]);
    process.stdout.write(`--- ${keyName} --- | --- ${token} ---\n`)
  });
};

setInterval(() => {
  showOTPs();
}, 5000);
showOTPs();
