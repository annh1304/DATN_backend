//user_service tương tác vs bảng user
//hàm login (modul);
const userModel = require('./user_model');
const bcrypt = require('bcryptjs');
//local
exports.login = async (username, password) =>{
    try {
        let user = await userModel.find({username});//find{return arr[]}
        if (user.length > 0){
            return user[0];
        }
        return null;
    } catch (error) {
        throw new Error('lỗi đăng nhập');
    }
}
//api
exports.signin = async (username) =>{
    try {
        let user = await userModel.find({username});//find{return arr[]}
        if (user.length > 0){
            return user[0];
        }
        return null;
    } catch (error) {
        throw new Error('lỗi đăng nhập');
    }
}
//api
exports.signup = async (username, password) =>{
    // if(!checkUsername(username)){
    //     const user = new userModel({username, password}); 
    //     return await user.save();
    // }
    const user = new userModel({username, password}); 
    return await user.save();
}

exports.checkUsername = async (username) => {
    try {
        let user = await userModel.find({username});
        if (user.length > 0){
            return true;
        }else{
            return false;
        }
    } catch (error) {
        throw new Error('lỗi');
    }
}

exports.getInfo = async (id) =>{
    const user = await userModel.findById(id);
    return user;
}

var users = [
    {_id: 1, username: 'admin', password: 'admin',},
    {_id: 2, username: 'user1', password: 'user1',},
]