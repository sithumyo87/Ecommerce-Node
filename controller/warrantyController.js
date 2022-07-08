const DB = require('../models/warranty');
const Helper = require('../utilies/helper');

const all = async(req,res,next) => {
    let result = await DB.find();
    Helper.fMsg(res,"All Warranties Here!!",result);
}

const add = async(req,res,next ) => {
    let dbWarranty = await DB.findOne({name:req.body.name});
    if(dbWarranty){
        next(new Error("Warranty Name Already Existed!!"))
    }else{
        req.body.remark = req.body.remark.split(',');
        let result = await DB(req.body).save();
        Helper.fMsg(res,"Added Warranty Successfully",result);
    }
}

const get = async(req,res,next) => {
    let dbWarranty = await DB.findById(req.params.id);
    if(dbWarranty){
        Helper.fMsg(res,"GEt Single Warranty",dbWarranty);
    }else{
        next(new Error("No Warranty With that Id For SIngel Get"))
    }
}

const patch = async(req,res,next) => {
    let dbWarranty = await DB.findById(req.params.id);
    if(dbWarranty){
        req.body.remark = req.body.remark.split(',');
        await DB.findByIdAndUpdate(dbWarranty._id,req.body);
        let result = await DB.findById(dbWarranty.id);
        Helper.fMsg(res,"Updated Single Warranty",result);
    }else{
        next(new Error("No Warranty With that Id For Patching"))
    }
}

const drop = async(req,res,next) => {
    let dbWarranty = await DB.findById(req.params.id);
    if(dbWarranty){
        await DB.findByIdAndDelete(dbWarranty._id);
        Helper.fMsg(res,"Deleted Single Warranty");
    }else{
        next(new Error("No Warranty With that Id For Dropping"))
    }
}

module.exports =  {
    add,
    all,
    drop,
    get,
    patch
}