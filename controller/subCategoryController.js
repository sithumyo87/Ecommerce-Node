const DB = require('../models/subcat');
const Helper = require('../utilies/helper');
const CatDB = require('../models/category');

const add = async(req,res,next)=>{
    const subCatName = await DB.findOne({name:req.body.name});
    if(subCatName){
        next(new Error("already Exists Sub Category Name"));
    }else{
        
        let catdb = await CatDB.findById(req.body.catId);
        if(catdb){
            let result = await DB(req.body).save();
            await CatDB.findByIdAndUpdate(catdb._id,{$push:{subcats:result._id}})
            Helper.fMsg(res,"Added Sub Category",result);
        }else{
            next(new Error("Doesnt have category Id for Sub Cat Add"));
        }
    }
};

const all = async(req,res)=>{
    const subCatdb = await DB.find().populate('childCats');
    Helper.fMsg(res,"All Sub Categories",subCatdb);
};

const get = async(req,res,next)=> {
    const subcat = await DB.findById(req.params.id);
    if(subcat){
        Helper.fMsg(res,"Get One Category",subcat);
    }else{
        next(new Error("No Match Id to get Sub Category"));
    }
}

const drop = async(req,res,next) => {
    const subCatdb = await DB.findById(req.params.id);
    console.log(subCatdb);
    if(subCatdb){
        const catdb = await CatDB.find();
        await CatDB.findByIdAndUpdate(catdb._id,{$pull : {subcats:subCatdb._id}});
        const result = await DB.findByIdAndDelete(subCatdb._id);
        Helper.fMsg(res,"Delete Successfully");
    }else{
        next(new Error("No match with that category id to delete"));
    }
}

const patch = async(req,res,next) => {
    const subcat = await DB.findById(req.params.id);
    if(subcat){
        await DB.findByIdAndUpdate(subcat._id,req.body);
        const result = await DB.findById(subcat._id);
        Helper.fMsg(res,"Successfullly UPdated",result);
    }else{
        next(new Error("No sub Category with that id"));
    }
}


module.exports ={
    add,
    all,
    drop,
    get,
    patch
}