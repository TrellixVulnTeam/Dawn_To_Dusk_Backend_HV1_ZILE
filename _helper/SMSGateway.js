const nodemailer = require('nodemailer');
const config = require("../config.json");
const https = require('https');
var Axios = require('axios');
const { get } = require('http');
const { BADHINTS } = require('dns');
const { channel } = require('diagnostics_channel');

const Send_SMSCountry_gateway = async (to_phone, OTP, message) => {
    
    var userstr = '?User=' + config['SMSCountry_user']
    var passstr = '&passwd=' + config['SMSCountry_password']
    var mobilestr = '&mobilenumber=' + to_phone
    var msgstr = '&message=' + config['SMSCountry_message']
    var sdistr = '&sid=' + config['SMSCountry_senderid']
    var mtypestr = '&mtype=' + config['SMSCountry_messagetype']
    var drstr = '&DR=' + config['SMSCountry_DReports']

    var sms_url = config['SMSCountry_url'] + userstr + passstr + mobilestr + msgstr + sdistr + mtypestr + drstr
    console.log(sms_url)

    var headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    Axios({
        method: "POST",
        url: sms_url,
        headers: headers
    }).then(res => {
        console.log(res.data)
        if (res.data.Status === "Success") {
            console.log("success")
            return true
        }
        else {
            console.log("faild")
            return false
        }
    }).catch(err => {
        console.log('error', err)
        return false
    })
}

const SendFactoryOTP = async (to_phone, OTP, message) => {
    var host = "https://2factor.in/API/V1/" + config['2Factory_API_Key'] + "/SMS/" + to_phone + "/" + OTP + "/D2D"
    console.log(host)

    var headers = {
        "Content-Type": "application/json"
      };
    Axios({
        method: "GET",
        url: host,
        headers: headers
    }).then(res => {
        console.log(res.data)
        if (res.data.Status === "Success") {
            console.log("success")
            return true
        }
        else {
            console.log("faild")
            return false
        }
    }).catch(err => {
        console.log('error', err)
        return false
    })
}

module.exports = {
    SendFactoryOTP,
    Send_SMSCountry_gateway
}