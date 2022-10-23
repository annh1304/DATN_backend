const categoryModel = require('./category_model');

const getAll = async () => {
    // return categories;
    return await categoryModel.find({});
}

module.exports = { getAll };

