const DB = require('../models/category');
const Helper = require('../utilies/helper');

const add = async(req,res,next) =>{
     let cat  =  await DB.findOne({name:req.body.name});
     if(cat){
        next(new Error("Already Exists Category"));
     }else{
        let result = await new DB(req.body).save();
        Helper.fMsg(res,"Add Category",result);
     }
}

const all = async(req,res,next)=>{
   let allCat = await DB.find().populate({
      path:'subcats',
      populate:{
         path:'childCats',
         model:'childsub'
      },
   });
   if(allCat){
      Helper.fMsg(res,"All Category",allCat);
   }else{
      next(new Error("Empty Category"));
   }
}

const get = async(req,res,next)=>{
   let catdb = await DB.findById(req.params.id);
   if(catdb){
      Helper.fMsg(res,"Get One Category",catdb);
   }else{
      next(new Error("doesnt have with this id cat"));
   }
}

const patch = async(req,res,next) =>{
   let catdb= await DB.findById(req.params.id);
   if(catdb){
      await DB.findByIdAndUpdate(catdb._id,req.body);
      let result = await DB.findById(catdb._id);
      Helper.fMsg(res,"Update Category",result);
   }else{
      next(new Error("Doesn't have this id in category"))
   }
}

const drop = async(req,res,next)=>{
   let catdb = await DB.findById(req.params.id);
   if(catdb){
      await DB.findByIdAndDelete(catdb._id);
      Helper.fMsg(res,"Successfully Deleted");
   }else{
      next(new Error("Doesnt have id category for delete"))
   }
}

module.exports ={
    add,
    get,
    all,
    patch,
    drop
}