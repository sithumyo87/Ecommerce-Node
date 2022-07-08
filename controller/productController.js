const DB = require('../models/product');
const Helper = require('../utilies/helper');

const add = async(req,res,next) => {
    let dbproduct = await DB.findOne({name:req.body.name});
    if(dbproduct){
        next(new Error("Already Existed This product"));
    }else{
        req.body.feature= req.body.feature.split(",");
        req.body.delivery= req.body.delivery.split(",");
        req.body.warranty= req.body.warranty.split(",");
        req.body.colors= req.body.colors.split(",");
        let result = await DB(req.body).save();
        Helper.fMsg(res,"Add Product Successfully",result);
    }
}

const get = async(req,res,next) => {
    let dbProduct = await DB.findById(req.params.id);
    if(dbProduct) {
        Helper.fMsg(res,"Single Product",dbProduct);
    }else{
        next(new Error("No Product with that id"));
    }
}

const paginate = async(req,res) =>{
    let PageNo = Number(req.params.page);
    let Limit = Number(process.env.PAGE_LIMIT);
    let ReqPage = PageNo == 1 ? 0 : PageNo - 1;
    let total = Limit * ReqPage;
    let result = await DB.find().skip(total).limit(Limit);
    Helper.fMsg(res,`Product Paginate By ${PageNo}`,result);
}

const patch = async(req,res,next) => {
    let dbProduct = await DB.findById(req.params.id);
    if(dbProduct) {
        if(req.body.feature || req.body.delivery ||  req.body.warranty || req.body.colors){
            req.body.feature= req.body.feature.split(",");
            req.body.delivery= req.body.delivery.split(",");
            req.body.warranty= req.body.warranty.split(",");
            req.body.colors= req.body.colors.split(",");
        }   
        await DB.findByIdAndUpdate(dbProduct._id,req.body);
        let result = await DB.findById(dbProduct.id);
        Helper.fMsg(res,"Updated Product",result);
    }else{
        next(new Error("No Product with that id For patching"));
    }
}

const drop = async(req,res,next) => {
    let dbProduct = await DB.findById(req.params.id);
    if(dbProduct) {
        await DB.findByIdAndDelete(dbProduct._id);
        Helper.fMsg(res,"Deleted Product");
    }else{
        next(new Error("No Product with that id For deleteding"));
    }
}

const filterByType = async(req,res,next) => {
    let type = req.params.type;
    let PageNo = Number(req.params.page);
    let Limit = Number(process.env.PAGE_LIMIT);
    let ReqPage = PageNo == 1 ? 0 : PageNo - 1;
    let total = Limit * ReqPage;

    let filterType = 'cat';
    switch(type){
    case 'cat' : filterType = 'cat';break;
    case 'subcat' : filterType = 'subcat';break;
    case 'childcat' : filterType = 'childcat';break;
    case 'tag' : filterType = 'tag';break;
    }

    
    let filterObj = {};
    filterObj[`${filterType}`] =req.params.id;
    console.log(filterObj[`${filterType}`]);
    console.log(filterObj);
    let result = await DB.find(filterObj).skip(total).limit(Limit);
    Helper.fMsg(res,`Product Paginate By ${PageNo}`,result);

}

module.exports = {
    add,
    paginate,
    drop,
    patch,
    get,
    filterByType
}