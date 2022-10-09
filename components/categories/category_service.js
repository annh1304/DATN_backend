const categoryModel = require('./category_model');

const get = async () => {
    // return categories;
    return await categoryModel.find({});
}

module.exports = {get};
 
// var categories = [{
//     "_id": 1,
//     "name": "MAXALT-MLT",
//     "description": "Ntags"
//   }, {
//     "_id": 2,
//     "name": "Lovastatin",
//     "description": "Edgewire"
//   }, {
//     "_id": 3,
//     "name": "Pantoprazole Sodium",
//     "description": "Skilith"
//   }, {
//     "_id": 4,
//     "name": "Antacid",
//     "description": "Kare"
//   }, {
//     "_id": 5,
//     "name": "FEMCON Fe",
//     "description": "Kaymbo"
//   }]