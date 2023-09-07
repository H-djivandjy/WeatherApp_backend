var express = require('express');
var router = express.Router();

const fetch = require('node-fetch');

//----------- Model Import -----------
const User = require('../models/users');
//----------- Module Function Import -----------
const {checkBody} = require('../modules/checkBody')



//! --------> SIGNUP
router.post('/signup', (req, res)=>{
    // REQ Field ______________
    const email = req.body.email
    const password = req.body.password

    if(!checkBody(req.body, ["name", "email","password"])){
        res.json({result:   false, error: 'Missing or empty fields'})
        return;
    }
    //* INITIAL CONDITION WITHTOUT FUNCTION :
    // if(!email || !password){
    //     res.json({result:   false, error: 'Missing or empty fields'})
    //     return;
    // }

    User.findOne({email : email})
        .then((emailUsed)=>{
            if (emailUsed) {
                res.json({ result: false, error: 'User already exists' })
            }else{
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                })
                newUser.save().then((newUserData)=>{
                    console.log(newUserData)
                    
                    res.json({ result: true, message: 'User has been saved' })
                })
            }
        })
})


//! --------> LOGIN
  
router.post('/signin', (req,res)=>{
    // Check if signin data is valid
    const email = req.body.email
    const password = req.body.password

    if (!checkBody(req.body, ["email","password"])) {
        res.json({ result: false, error: 'Missing or empty fields' })
        return;
    }
    //* INITIAL CONDITION WITHTOUT FUNCTION :
    // if (!email || !password) {
    //     res.json({ result: false, error: 'Missing or empty fields' })
    //     return;
    // }

    User.findOne({email : email, password : password})
        .then((validData)=>{
            if (validData) {
                //user registered
                res.json({ result: true })
            }else{
                // user is not signup
                res.json({ result: false, error : 'User not found' })
            }
        })

})


module.exports = router;
