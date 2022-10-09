const categoriesService = require('./category_service');

const get = async () =>{
    return await categoriesService.get();
}

module.exports = {get};