const { request } = require('express');
var express = require('express');
var router = express.Router(); 
const jwt = require('jsonwebtoken');
const authen = require('../middleware/authen');


const userController = require ('../components/users/user_controller');
//đăng ký
router.post('/signup', async function (req, res, next){
    try {
        const {username, password} = req.body;
        const user = await userController.signup(username, password);
        console.log(user);
        res.status(200).json(user);    
    } catch (error) {
        res.status(500).json({error});
    }
})
//đăng nhập
router.post('/signin', async function (req, res, next){
    try {
        const {username, password} = req.body;
        const token = await userController.signin(username, password);
        console.log(token);
        res.status(200).json({error: false, token});    
    } catch (error) {
        res.status(500).json({error});
    }
})

router.get('/user-info', async function (req, res, next){
    try {
        const token = req.headers.authorization.split(' ')[1];
        // const {id} = req.query;
        const user = await userController.getInfo(token);
        res.status(200).json(user);
    } catch (error) {
        res.status(501).json({error});
    }
});


//đăng nhập web
router.post('/dang-nhap', async function(req, res, next){
    try{
        const {username, password} = req.body;
        const user = await userController.login(username, password);
        if(user){
            req.session.user = user;
            
        }else{
            
        }
    }catch(error){
        
    }
})

module.exports = router;