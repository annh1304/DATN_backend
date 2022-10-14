const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const categorySchema = new Schema({
    _id: { type: ObjectId },
    name: { type: String, maxLength: 50 },
    description: { type: String },
    image: { type: String },
});

module.exports = mongoose.model('category', categorySchema);