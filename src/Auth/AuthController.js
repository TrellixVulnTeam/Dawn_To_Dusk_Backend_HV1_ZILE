const express = require('express');
const router = express.Router();
const {checkMobileAuth} = require('../../middlewares/auth')
const AuthService = require('./AuthService.ts');
router.post('/authenticate',checkMobileAuth, authenticate);
router.post('/register',checkMobileAuth, register)
router.post('/login',checkMobileAuth, Login)
router.post('/varifyOtp',checkMobileAuth, VarifyOtp)
module.exports = router;
//login authenticate function

function Login(req, res, next) {
    if(!req.body.email){
        res.status(400).send({status:false,message:"email address not found!"})
    }
    if(!req.body.mobile){
        res.status(400).send({status:false,message:"Mobile number not found!"})
    }
    AuthService.userLogin(req.body)
    .then(user => user ? res.send(user) : res.status(400).send({status:false ,message: 'fullname  is incorrect' }))
    .catch(err => next(err));
}

function authenticate(req, res, next) {
    if(!req.body.email){
        res.status(400).send({status:false,message:"email address not found!"})
    }
    if(!req.body.mobile){
        res.status(400).send({status:false,message:"Mobile number not found!"})
    }
    AuthService.authenticate(req.body)
    .then(user => user ? res.send(user) : res.status(400).send({status:false ,message: 'fullname  is incorrect' }))
    .catch(err => next(err));
}

function VarifyOtp(req,res,next){
    AuthService.VerifyOTP(req.body)
    .then(user => user ? res.send(user) : res.status(400).send({status:false ,message: 'fullname  is incorrect' }))
    .catch(err => next(err));
}

function register(req,res, next){
    if(!req.body.email){
        res.status(400).send({status:false,message:"email address not found!"})
    }
    if(!req.body.mobile){
        res.status(400).send({status:false,message:"Mobile number not found!"})
    }
    AuthService.userRegister(req.body)
    .then(user => user ? res.send(user) : res.status(400).send({status:false ,message: 'fullname  is incorrect' }))
    .catch(err => next(err));
}