const DB = require('../models/Tag');
const Helper = require('../utilies/helper');

const all = async(req,res,next) => {
    let result = await DB.find();
    Helper.fMsg(res,"All Tags",result);
}

const add = async(req,res,next) => {
    let tag = await DB.findOne({name:req.body.name});
    if(tag){
        next(new Error("Already Exist Tag"))
    }else{
        let result = await DB(req.body).save();
        Helper.fMsg(res,"Added Tag Successfully",result);
    }
}

const get = async(req,res,next) => {
    let tag = await DB.findById(req.params.id);
    if(tag){
        Helper.fMsg(res,"Get Single Tag",tag);
    }else{
        next(new Error("No Tag with that id"))
    }
}

const patch = async(req,res,next) => {
    let tag = await DB.findById(req.params.id);
    if(tag){
        await DB.findByIdAndUpdate(tag._id,req.body);
        let result = await DB.findById(tag._id);
        Helper.fMsg(res,"Updated Successfully",result);
    }else{
        next(new Error("No Tag With that Id for Update"));
    }
}

const drop = async(req,res,next) => {
    let tag = await DB.findById(req.params.id);
    if(tag){
        await DB.findByIdAndDelete(tag._id);
        Helper.fMsg(res,"Updated Successfully");
    }else{
        next(new Error("No Tag With that Id for Update"));
    }
}

module.exports = {
    add,
    all,
    get,
    drop,
    patch
}