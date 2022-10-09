const productModel = require('./product_model');

const getAll = async (page, size) =>{
    //tìm theo trang 
    // const items = products.slice((page - 1) * size, page * size);
    // return items;

    // find({}) = điều kiện, vd: where name ....
    // page:2, size:3 || skip bỏ qua sp đầu
    const items = await productModel.find({})
                .skip((page - 1)*size)
                .limit(size);
    console.log(items);
    return items;
}

const getById = async (id) =>{
    //select id, name from product...
    // const product = products.find(product => product._id == id)
    // return product;

    const product = await productModel.findById(id);
    return product;
}

const insert = async (product) =>{
  // const p ={
  //   name : product.name,
  //   price : product.price,
  //   quantity : product.quantity,
  //   category_id: product.category_id,
  //   image: product.image,
  // }
  // products.push(p);

  const p = new productModel(product);
  await p.save(); 
}

const update = async (id, product) =>{
  // const p = products.find(p => p._id.toString() == id.toString());
  // p.name = product.name;
  // p.price = product.price;
  // p.quantity = product.quantity;
  // p.category_id=3;;
  // p.image = product.image ? product.image : p.image;

  if (!product.image){
    delete product.image;
  }else{

  }
  await productModel.findByIdAndUpdate(id,product);
}

const deleteById = async (id) =>{
  products = products.filter(p => p._id.toString() != id.toString());
  await productModel.findByIdAndDelete(id)
}

module.exports = {getAll, getById, insert, update, deleteById}



var products = [{
    "_id": 1,
    "name": "Claudina Markey",
    "price": 38756,
    "quantity": 4,
    "category_id": 3,
    "image": "https://m.media-amazon.com/images/I/71D9ImsvEtL._UY500_.jpg"
  }, {
    "_id": 2,
    "name": "Kirbie Mattedi",
    "price": 94963,
    "quantity": 20,
    "category_id": 1,
    "image": "https://scontent-sin6-4.xx.fbcdn.net/v/t39.30808-6/275413113_1380561049087995_6722831207436337363_n.jpg?stp=dst-jpg_p960x960&_nc_cat=100&ccb=1-7&_nc_sid=e3f864&_nc_ohc=bc78gKZtfS4AX8W9G5I&tn=kcK7CxaEPKwPaygU&_nc_ht=scontent-sin6-4.xx&oh=00_AT_v5niidLDRO_Yfzys0mss81vRS5H1ZANmRyZt1hIH8eg&oe=62E69554"
  }, {
    "_id": 3,
    "name": "Darcy Bettam",
    "price": 48626,
    "quantity": 77,
    "category_id": 4,
    "image": "https://scontent-sin6-4.xx.fbcdn.net/v/t39.30808-6/275413113_1380561049087995_6722831207436337363_n.jpg?stp=dst-jpg_p960x960&_nc_cat=100&ccb=1-7&_nc_sid=e3f864&_nc_ohc=bc78gKZtfS4AX8W9G5I&tn=kcK7CxaEPKwPaygU&_nc_ht=scontent-sin6-4.xx&oh=00_AT_v5niidLDRO_Yfzys0mss81vRS5H1ZANmRyZt1hIH8eg&oe=62E69554"
  }, {
    "_id": 4,
    "name": "Lexi Canny",
    "price": 71689,
    "quantity": 76,
    "category_id": 1,
    "image": "https://scontent-sin6-4.xx.fbcdn.net/v/t39.30808-6/275413113_1380561049087995_6722831207436337363_n.jpg?stp=dst-jpg_p960x960&_nc_cat=100&ccb=1-7&_nc_sid=e3f864&_nc_ohc=bc78gKZtfS4AX8W9G5I&tn=kcK7CxaEPKwPaygU&_nc_ht=scontent-sin6-4.xx&oh=00_AT_v5niidLDRO_Yfzys0mss81vRS5H1ZANmRyZt1hIH8eg&oe=62E69554"
  }, {
    "_id": 5,
    "name": "Helge Mowles",
    "price": 55145,
    "quantity": 4,
    "category_id": 2,
    "image": "https://scontent-sin6-4.xx.fbcdn.net/v/t39.30808-6/275413113_1380561049087995_6722831207436337363_n.jpg?stp=dst-jpg_p960x960&_nc_cat=100&ccb=1-7&_nc_sid=e3f864&_nc_ohc=bc78gKZtfS4AX8W9G5I&tn=kcK7CxaEPKwPaygU&_nc_ht=scontent-sin6-4.xx&oh=00_AT_v5niidLDRO_Yfzys0mss81vRS5H1ZANmRyZt1hIH8eg&oe=62E69554"
  }, {
    "_id": 6,
    "name": "Jacquie Eslinger",
    "price": 42040,
    "quantity": 98,
    "category_id": 1,
    "image": "https://scontent-sin6-4.xx.fbcdn.net/v/t39.30808-6/275413113_1380561049087995_6722831207436337363_n.jpg?stp=dst-jpg_p960x960&_nc_cat=100&ccb=1-7&_nc_sid=e3f864&_nc_ohc=bc78gKZtfS4AX8W9G5I&tn=kcK7CxaEPKwPaygU&_nc_ht=scontent-sin6-4.xx&oh=00_AT_v5niidLDRO_Yfzys0mss81vRS5H1ZANmRyZt1hIH8eg&oe=62E69554"
  }, {
    "_id": 7,
    "name": "Sydelle Ogg",
    "price": 55600,
    "quantity": 86,
    "category_id": 3,
    "image": "https://scontent-sin6-4.xx.fbcdn.net/v/t39.30808-6/275413113_1380561049087995_6722831207436337363_n.jpg?stp=dst-jpg_p960x960&_nc_cat=100&ccb=1-7&_nc_sid=e3f864&_nc_ohc=bc78gKZtfS4AX8W9G5I&tn=kcK7CxaEPKwPaygU&_nc_ht=scontent-sin6-4.xx&oh=00_AT_v5niidLDRO_Yfzys0mss81vRS5H1ZANmRyZt1hIH8eg&oe=62E69554"
  }, {
    "_id": 8,
    "name": "Myrtia Hebborn",
    "price": 29817,
    "quantity": 68,
    "category_id": 4,
    "image": "https://scontent-sin6-4.xx.fbcdn.net/v/t39.30808-6/275413113_1380561049087995_6722831207436337363_n.jpg?stp=dst-jpg_p960x960&_nc_cat=100&ccb=1-7&_nc_sid=e3f864&_nc_ohc=bc78gKZtfS4AX8W9G5I&tn=kcK7CxaEPKwPaygU&_nc_ht=scontent-sin6-4.xx&oh=00_AT_v5niidLDRO_Yfzys0mss81vRS5H1ZANmRyZt1hIH8eg&oe=62E69554"
  }, {
    "_id": 9,
    "name": "Danny Measen",
    "price": 96854,
    "quantity": 2,
    "category_id": 5,
    "image": "https://scontent-sin6-4.xx.fbcdn.net/v/t39.30808-6/275413113_1380561049087995_6722831207436337363_n.jpg?stp=dst-jpg_p960x960&_nc_cat=100&ccb=1-7&_nc_sid=e3f864&_nc_ohc=bc78gKZtfS4AX8W9G5I&tn=kcK7CxaEPKwPaygU&_nc_ht=scontent-sin6-4.xx&oh=00_AT_v5niidLDRO_Yfzys0mss81vRS5H1ZANmRyZt1hIH8eg&oe=62E69554"
  }, {
    "_id": 10,
    "name": "Rudy Whitticks",
    "price": 83467,
    "quantity": 69,
    "category_id": 5,
    "image": "https://scontent-sin6-4.xx.fbcdn.net/v/t39.30808-6/275413113_1380561049087995_6722831207436337363_n.jpg?stp=dst-jpg_p960x960&_nc_cat=100&ccb=1-7&_nc_sid=e3f864&_nc_ohc=bc78gKZtfS4AX8W9G5I&tn=kcK7CxaEPKwPaygU&_nc_ht=scontent-sin6-4.xx&oh=00_AT_v5niidLDRO_Yfzys0mss81vRS5H1ZANmRyZt1hIH8eg&oe=62E69554"
  }, {
    "_id": 11,
    "name": "Vick Nise",
    "price": 274,
    "quantity": 67,
    "category_id": 4,
    "image": "https://scontent-sin6-4.xx.fbcdn.net/v/t39.30808-6/275413113_1380561049087995_6722831207436337363_n.jpg?stp=dst-jpg_p960x960&_nc_cat=100&ccb=1-7&_nc_sid=e3f864&_nc_ohc=bc78gKZtfS4AX8W9G5I&tn=kcK7CxaEPKwPaygU&_nc_ht=scontent-sin6-4.xx&oh=00_AT_v5niidLDRO_Yfzys0mss81vRS5H1ZANmRyZt1hIH8eg&oe=62E69554"
  }, {
    "_id": 12,
    "name": "Audrey Bennit",
    "price": 72581,
    "quantity": 74,
    "category_id": 3,
    "image": "https://scontent-sin6-4.xx.fbcdn.net/v/t39.30808-6/275413113_1380561049087995_6722831207436337363_n.jpg?stp=dst-jpg_p960x960&_nc_cat=100&ccb=1-7&_nc_sid=e3f864&_nc_ohc=bc78gKZtfS4AX8W9G5I&tn=kcK7CxaEPKwPaygU&_nc_ht=scontent-sin6-4.xx&oh=00_AT_v5niidLDRO_Yfzys0mss81vRS5H1ZANmRyZt1hIH8eg&oe=62E69554"
  }, {
    "_id": 13,
    "name": "Sutherland Muglestone",
    "price": 56752,
    "quantity": 49,
    "category_id": 2,
    "image": "https://scontent-sin6-4.xx.fbcdn.net/v/t39.30808-6/275413113_1380561049087995_6722831207436337363_n.jpg?stp=dst-jpg_p960x960&_nc_cat=100&ccb=1-7&_nc_sid=e3f864&_nc_ohc=bc78gKZtfS4AX8W9G5I&tn=kcK7CxaEPKwPaygU&_nc_ht=scontent-sin6-4.xx&oh=00_AT_v5niidLDRO_Yfzys0mss81vRS5H1ZANmRyZt1hIH8eg&oe=62E69554"
  }, {
    "_id": 14,
    "name": "Chrystal Twamley",
    "price": 97784,
    "quantity": 17,
    "category_id": 1,
    "image": "https://scontent-sin6-4.xx.fbcdn.net/v/t39.30808-6/275413113_1380561049087995_6722831207436337363_n.jpg?stp=dst-jpg_p960x960&_nc_cat=100&ccb=1-7&_nc_sid=e3f864&_nc_ohc=bc78gKZtfS4AX8W9G5I&tn=kcK7CxaEPKwPaygU&_nc_ht=scontent-sin6-4.xx&oh=00_AT_v5niidLDRO_Yfzys0mss81vRS5H1ZANmRyZt1hIH8eg&oe=62E69554"
  }, {
    "_id": 15,
    "name": "Cathi Austin",
    "price": 15063,
    "quantity": 28,
    "category_id": 2,
    "image": "https://scontent-sin6-4.xx.fbcdn.net/v/t39.30808-6/275413113_1380561049087995_6722831207436337363_n.jpg?stp=dst-jpg_p960x960&_nc_cat=100&ccb=1-7&_nc_sid=e3f864&_nc_ohc=bc78gKZtfS4AX8W9G5I&tn=kcK7CxaEPKwPaygU&_nc_ht=scontent-sin6-4.xx&oh=00_AT_v5niidLDRO_Yfzys0mss81vRS5H1ZANmRyZt1hIH8eg&oe=62E69554"
  }, {
    "_id": 16,
    "name": "Kailey Marusyak",
    "price": 64500,
    "quantity": 61,
    "category": 3,
    "image": "https://scontent-sin6-4.xx.fbcdn.net/v/t39.30808-6/275413113_1380561049087995_6722831207436337363_n.jpg?stp=dst-jpg_p960x960&_nc_cat=100&ccb=1-7&_nc_sid=e3f864&_nc_ohc=bc78gKZtfS4AX8W9G5I&tn=kcK7CxaEPKwPaygU&_nc_ht=scontent-sin6-4.xx&oh=00_AT_v5niidLDRO_Yfzys0mss81vRS5H1ZANmRyZt1hIH8eg&oe=62E69554"
  }, {
    "_id": 17,
    "name": "Holly Crockley",
    "price": 33077,
    "quantity": 3,
    "category_id": 3,
    "image": "https://scontent-sin6-4.xx.fbcdn.net/v/t39.30808-6/275413113_1380561049087995_6722831207436337363_n.jpg?stp=dst-jpg_p960x960&_nc_cat=100&ccb=1-7&_nc_sid=e3f864&_nc_ohc=bc78gKZtfS4AX8W9G5I&tn=kcK7CxaEPKwPaygU&_nc_ht=scontent-sin6-4.xx&oh=00_AT_v5niidLDRO_Yfzys0mss81vRS5H1ZANmRyZt1hIH8eg&oe=62E69554"
  }, {
    "_id": 18,
    "name": "Margi Scargill",
    "price": 53063,
    "quantity": 12,
    "category_id": 4,
    "image": "https://scontent-sin6-4.xx.fbcdn.net/v/t39.30808-6/275413113_1380561049087995_6722831207436337363_n.jpg?stp=dst-jpg_p960x960&_nc_cat=100&ccb=1-7&_nc_sid=e3f864&_nc_ohc=bc78gKZtfS4AX8W9G5I&tn=kcK7CxaEPKwPaygU&_nc_ht=scontent-sin6-4.xx&oh=00_AT_v5niidLDRO_Yfzys0mss81vRS5H1ZANmRyZt1hIH8eg&oe=62E69554"
  }, {
    "_id": 19,
    "name": "Sherwynd Salatino",
    "price": 65181,
    "quantity": 93,
    "category_id": 5,
    "image": "https://scontent-sin6-4.xx.fbcdn.net/v/t39.30808-6/275413113_1380561049087995_6722831207436337363_n.jpg?stp=dst-jpg_p960x960&_nc_cat=100&ccb=1-7&_nc_sid=e3f864&_nc_ohc=bc78gKZtfS4AX8W9G5I&tn=kcK7CxaEPKwPaygU&_nc_ht=scontent-sin6-4.xx&oh=00_AT_v5niidLDRO_Yfzys0mss81vRS5H1ZANmRyZt1hIH8eg&oe=62E69554"
  }, {
    "_id": 20,
    "name": "Izaak Beddingham",
    "price": 8094,
    "quantity": 85,
    "category_id": 1,
    "image": "https://scontent-sin6-4.xx.fbcdn.net/v/t39.30808-6/275413113_1380561049087995_6722831207436337363_n.jpg?stp=dst-jpg_p960x960&_nc_cat=100&ccb=1-7&_nc_sid=e3f864&_nc_ohc=bc78gKZtfS4AX8W9G5I&tn=kcK7CxaEPKwPaygU&_nc_ht=scontent-sin6-4.xx&oh=00_AT_v5niidLDRO_Yfzys0mss81vRS5H1ZANmRyZt1hIH8eg&oe=62E69554"
  }]
  