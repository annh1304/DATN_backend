//
const userService = require('./user_service');
const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken');
//local
exports.login = async (username, password) =>{
    try {
        return await userService.login(username, password);   
    } catch (error) {
        throw new Error('error');
    }
}


//api
exports.signup = async (username, password) =>{
    const check = await userService.checkUsername(username);    
    try {
        if(check){
            throw new Error('Tên tài khoản đã tồn tại!');
            return;
        }
        //check document for detail | hashPassword => mã hóa pass(random)
        const hashPassword = await bcrypt.hashSync(password, 10);
        return await userService.signup(username, hashPassword);
    } catch (error) {
        throw new Error(error.message ||'Lỗi đăng nhập');
    }
}

exports.signin = async (username, password)=>{
    try {
        const user = await userService.signin(username);
        if (user){
            const check = await bcrypt.compareSync(password, user.password);
            if (check){
                //đăng nhập tạo token (user name là id của user)
                const token = jwt.sign({ username:user.username, _id:user._id},
                     'secret', {expiresIn:30 * 24 * 60 * 60});//30 ngày
                //tạo refresh token 90 days (expires)
                //return token;
                return token;
            }else{
                throw new Error('Đăng nhập không thành công');//sai mật khẩu
            }
        }else{
            throw new Error(error.message ||'Không tìm thấy tài khoản');
        }
    } catch (error) {
        throw new Error(error.message ||'Đăng nhập không thành công!');
    }
}
//đưa token lên sv lấy user info
exports.getInfo = async (token) =>{
    try {
        const decoded = jwt.verify(token, 'secret');
        console.log(decoded);
        return await userService.getInfo(decoded._id);
    } catch (error) {
        console.log(error);
        throw new Error(error.message || 'lỗi');
    }
}

