const mongoose = require('mongoose');
const { Schema } = mongoose;

const subCategorySchema = new Schema({
    name:{type:String,required:true,unique:true},
    image:{type:String,required:true},
    catId:{type:Schema.Types.ObjectId,ref:'category'},
    childCats:[{type:Schema.Types.ObjectId,ref:'childsub'}],
    created:{type:Date,default:Date.now},
})

const subCats = mongoose.model("subCat",subCategorySchema);
module.exports = subCats;