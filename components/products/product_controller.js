const productService = require('./product_service');
const categoryService = require('../categories/category_service');

const getAll = async (page, size) =>{
    page = page || 1;
    size = size || 5;
    return await productService.getAll(page, size);
}

const getById = async (id) =>{
    //select id, name from product...
    const product = await productService.getById(id);
    let categories = await categoryService.get();
    console.log(product);
    console.log(categories);
    // old
    // categories = categories.map(category =>{
    //     category = { ...category, isSelected:false};
    //     if (product.category_id.toString() == category._id.toString()){
    //         category.isSelected = true;
    //     }
    //     return category;
    // }); 
    //new
    categories = categories.map(category =>{
        let c = {
            _id : category._id,
            name : category.name,
            description : category.description,
            isSelected : false
        }
        if (product.category_id.toString() == c._id.toString()){
                 c.isSelected = true;
        }
        return c;
    });
    return {product, categories};
}

const insert = async (product) =>{
    await productService.insert(product);
}

const update = async (id, product) =>{
    await productService.update(id, product);
}

const deleteById = async (id) =>{
    await productService.deleteById(id);
}

module.exports = {getAll, getById, insert, update, deleteById};