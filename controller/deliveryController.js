const DB = require('../models/delivery');
const Helper = require('../utilies/helper');

const all = async(req,res,next) => {
    let result = await DB.find();
    Helper.fMsg(res,"All Deliveries",result);
}   

const add = async(req,res,next) => {
    let dbDelivery = await DB.findOne({name:req.body.name});
    if(dbDelivery) {
        next(new Error("Already Use that Delivery Name"));
    }else{
        req.body.remark = req.body.remark.split(',');
        let result = await DB(req.body).save();
        Helper.fMsg(res,"Add Delivery Successfully",result);
    }
}

const get = async(req,res,next) => {
    let dbDelivery = await DB.findById(req.params.id);
    if(dbDelivery){
        Helper.fMsg(res,"Get Single Delivery",dbDelivery);
    }else{
        next(new Error("No Delivery With that Id for single Get"));
    }
}

const patch = async(req,res,next) => {
    let dbDelivery = await DB.findById(req.params.id);
    if(dbDelivery){
        req.body.remark = req.body.remark.split(',');
        await DB.findByIdAndUpdate(dbDelivery._id,req.body);
        let result = await DB.findById(dbDelivery._id);
        Helper.fMsg(res,"Updated Delivery",result);
    }else{
        next(new Error("No Delivery With that Id for Patch"));
    }
}

const drop = async(req,res,next) => {
    let dbDelivery = await DB.findById(req.params.id);
    if(dbDelivery){
        await DB.findByIdAndDelete(dbDelivery._id);
        Helper.fMsg(res,"Deleted Single Delivery");
    }else{
        next(new Error("No Delivery With that Id for Delete"));
    }
}

module.exports = {
    add,
    get,
    all,
    patch,
    drop
}