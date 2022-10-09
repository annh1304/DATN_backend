const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const productSchema = new Schema({
    // id: { type: ObjectId },
    name: { type: String },
    price: { type: Number },
    quantity: { type: Number },
    image: { type: String },
    // description: { type: String },
    category_id: { type: Schema.Types.ObjectId, ref: 'category' }, // khóa ngoại
    // released: { type: Date },
});

module.exports = mongoose.model('product', productSchema);