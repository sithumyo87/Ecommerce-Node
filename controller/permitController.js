const DB = require('../models/permit');
const Helper = require('../utilies/helper');

const add = async(req,res,next) => {
    let permitName = await DB.findOne({name:req.body.name});
    if(permitName){
        next(new Error("Permit Name already Exists!!"));
    }else{
        let permitData = await new DB(req.body).save();
        Helper.fMsg(res,"Permit Uploaded",permitData)
    }
}

const get = async(req,res,next) => {
    let permitId = await DB.findById(req.params.id);
    console.log(permitId);
    if(permitId){
        Helper.fMsg(res,"Get Permit By Id",permitId)
    }else{
        next(new Error('Cannot Find Permit By using Id'))
    }
}

const all = async(req,res,next) => {
    let result = await DB.find();
    Helper.fMsg(res,"All Permits",result);
}

const putch = async(req,res,next)=>{
    let permitId = await DB.findById(req.params.id);
    if(permitId){
        await DB.findByIdAndUpdate(permitId,req.body);
        let result = await DB.findById(req.params.id);
        Helper.fMsg(res,"Successfully Updated",result);
    }else{
        next(new Error("Something wrong with Permit Edit"))
    }
}

const deletePer = async(req,res,next)=>{
    let permitId = await DB.findById(req.params.id);
    if(permitId){
        await DB.findByIdAndDelete(permitId);
        Helper.fMsg(res,"Successfully Deleted");
    }else{
        next(new Error("Something wrong with Permit Delete"))
    }
}

module.exports = {
    add,
    get,
    all,
    putch,
    deletePer
}