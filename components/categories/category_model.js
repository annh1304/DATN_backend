const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const categorySchema = new Schema({
    _id:{ type: Schema.Types.ObjectId},
    name: { type: String },
    description: { type: String },
});

module.exports = mongoose.model('category', categorySchema);