const DB = require('../models/childcat');
const subCatDB = require('../models/subcat');
const Helper = require("../utilies/helper");


const all = async(req,res,next) => {
    let result = await DB.find();
    Helper.fMsg(res,"ALL Child Categories",result);
}  

const get = async(req,res,next) => {
    const childCat = await DB.findById(req.params.id);
    if(childCat){
        Helper.fMsg(res,"GEt Singel Child Cat",childCat);
    }else{
        next(new Error("No Match Id with that Child Category"));
    }
}


const add = async(req,res,next)=> {
    const childCat = await DB.findOne({name:req.body.name});
    if(childCat){
        next(new Error("Already Have Name for child Category"));
    }else{
        let subcat = await subCatDB.findById(req.body.subcatId);
        if(subcat){
            let result = await DB(req.body).save();
            await subCatDB.findByIdAndUpdate(subcat._id,{$push : {childCats : result._id}})
            Helper.fMsg(res,"Successsfully Posted Child Cat",result);
        }else{
            next(new Error("NO match with that Sub cat id"));
        }
    }
}

const drop = async(req,res,next) => {
    const childCat = await DB.findById(req.params.id);
    if(childCat){
        await subCatDB.findByIdAndUpdate(childCat.subcatId,{$pull  : {childCats:childCat.subcatId}});
        await DB.findByIdAndDelete(childCat._id);
        Helper.fMsg(res,"Successfully Deleted");
    }else{
        next(new Error("No Match Id with that Child Category"));
    }
}

const patch = async(req,res,next) => {
    const childCat = await DB.findById(req.params.id);
    if(childCat){
        await DB.findByIdAndUpdate(childCat._id,req.body);
        let result = await DB.find();
        Helper.fMsg(res,"Update SUccessfully",result);
    }else{
        next(new Error("No Match Id with that Child Category"));
    }
}

module.exports = {
    add,
    all,
    drop,
    patch,
    get
}