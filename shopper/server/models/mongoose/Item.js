const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema(
  {
    sku: { type: Number, required: true, index: { unique: true } },
    name: { type: String, required: true },
    price: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);
const ItemModel = mongoose.model('Item', ItemSchema);
module.exports = ItemModel;
