const mongoose = require('mongoose');
const { Schema } = mongoose;

const childSubSchema = new Schema({
    name:{type:String,required:true,unique:true},
    image:{type:String,required:true},
    subcatId:[{type:Schema.Types.ObjectId,ref:'subcat'}],
    created:{type:Date,default:Date.now},
})

const childsub = mongoose.model("childsub",childSubSchema);
module.exports = childsub;