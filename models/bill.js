const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  billNo: {
    type: Number,
    required: true,
    unique: true,
    default:0
  },
  items:[],
  total:{
    type:Number,
    required:true
  },
  created_at:{type:Date,default:Date.now()},
});

/*
[
  { quantity: '3', price: '5', name: 'Butter Biscut', total: 15 },
  { quantity: '2', price: '20', name: 'coffe', total: 40 }
] 55
 */

const Item = mongoose.model('Bill', billSchema);

module.exports = Item;
