const mongoose = require('mongoose');
const { Schema } = mongoose;

const product = new Schema({
    name:{type:String,required:true,unique:true},
    price:{type:Number,required:true},
    brand:{type:String,required:true},
    cat:{type:Schema.Types.ObjectId,ref:'category'},
    subcat:{type:Schema.Types.ObjectId,ref:'subCat'},
    childcat:{type:Schema.Types.ObjectId,ref:'childsub'},
    tag:{type:Schema.Types.ObjectId,ref:'tag'},
    discount:{type:Number,default:0},
    feature:{type:Array,required:true},
    desc:{type:String,required:true},
    detail:{type:String,required:true},
    status:{type:Boolean,default:true},
    delivery:[{type:Schema.Types.ObjectId,ref:'delivery'}],
    warranty:[{type:Schema.Types.ObjectId,ref:'warranty'}],
    colors:{type:Array,required:true},
    size:{type:String,required:true},
    rating:{type:String,default:"0"},
    images:{type:Array,required:true},
    created:{type:Date,default:Date.now},
})

const Product = mongoose.model("product",product);
module.exports = Product;