const config = require("../../config.json");
const jwt = require("jsonwebtoken");
const db = require("../../_helper/db");
const dbUser = db.User;
const SMSGateway = require("../../_helper/SMSGateway");
const Cryptr = require("cryptr");
const cryptr = new Cryptr(config.jwtSecret);
const { setResData }= require('../../_helper/comman')
var rn = require("random-number");

const userLogin = async (userParams) => {
  const user = await dbUser.find({ mobile: userParams.mobile});
  if (user.length === 1) {
    var gen = rn.generator({
      min: 111111,
      max: 999999,
      integer: true,
    });
    const random = gen();

    var OTP_message =`Use D2D User verification code is `+random.toString() + 'for the Dawn To Dusk authentication.';
    var phoneNo = userParams.countrycode + userParams.mobile
    let sendResult = SMSGateway.sendDynamicOTP_client(phoneNo, "D2D User Verification", OTP_message);
    userParams.otp_token = random

    if (sendResult) {
      
      const findupdate = await dbUser.findByIdAndUpdate({
        '_id': user[0].id
      }, {$set: {"verify_otp":false, "otp_token": random.toString()}})

      return setResData(true, 200, {"otp": random.toString()} , "we otp send your register email address");
    } else {
      return false;
    }
  } else {
    return setResData(false, 401, null , "email is not registerd yet!")
  }
};

const userRegister = async (userParams) => {
  const user = await dbUser.find({mobile: userParams.mobile});

  var gen = rn.generator({
    min: 111111,
    max: 999999,
    integer: true,
  });
  const random = gen();

  if (user.length === 1) {
    const findupdate = await dbUser.findByIdAndUpdate({
      '_id': user[0].id
    }, {$set: {"verify_otp":false, "fullname": userParams.fullname, "otp_token": random.toString()}})
    if(findupdate){

    var OTP_message =`Use D2D User verification code is `+random.toString() + 'for the Dawn To Dusk authentication.';
    var phoneNo = userParams.countrycode + userParams.mobile
    let sendResult = SMSGateway.SendFactoryOTP(phoneNo, random)

      userParams.otp_token = random

      if (sendResult) {
        return setResData(true, 200, {"otp": random.toString()} , "we otp send your register email address");
      } else {
        return false;
      }

    }
  } else {
    var OTP_message =`Use D2D User verification code is `+random.toString() + 'for the Dawn To Dusk authentication.';
    var phoneNo = userParams.countrycode + userParams.mobile
    let sendResult = SMSGateway.SendFactoryOTP(phoneNo, random)
    
      userParams.otp_token = random
      if (sendResult) {
        var data = await new dbUser(userParams).save();
        if (data) {
          return setResData(true, 200, {"otp": random.toString()} , "we otp send your register email address");
        } else {
          return false;
        }
      } else {
        return false;
      }
  }
};

const VerifyOTP =async(userParams)=>{
  const userData = await dbUser.find({ otp_token : userParams.code });
  console.log('userData', userData)
  if(userData){
    const findupdate = await dbUser.findByIdAndUpdate({
      '_id': userData[0].id
    }, {$set: {"verify_otp":true}})
    if(findupdate){
      const newuserData = await dbUser.find({ otp_token : userParams.code });
      const encryptedString = cryptr.encrypt(newuserData[0].id)
      let token = jwt.sign({ id:encryptedString}, config.secret, { expiresIn: '1 day' });
      const updateddata  = {
        user:newuserData[0],
        accessToken:token,
        api_key: config.api_key
      }
      return setResData(true,200, updateddata , "verify OTP");
    }else{
        return setResData(false,400, '' , "something right wrong!");
     }
  }
}

module.exports = {
  userRegister,
  VerifyOTP ,
  userLogin
};
