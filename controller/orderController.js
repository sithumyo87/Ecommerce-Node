const DB = require('../models/order');
const orderItemDB = require('../models/orderitem');
const productDB = require('../models/product');
const Helper = require('../utilies/helper');

const add = async(req,res,next) =>{
    let user = req.user;
     let items = req.body.items;
    // console.log(items);

    let saveOrder = new DB();
    let orderItemObj = [];
    let total = 0;

    for await(let item of items){
        let product = await productDB.findById(item.id);
        // console.log(product);
        let obj = {
            order:saveOrder._id,
            count:item.count,
            productId:product._id,
            name:product.name,
            price:product.price
        }
        orderItemObj.push(obj);
        total += product.price * item.count;
    }
    let orderItemResult = await orderItemDB.insertMany(orderItemObj);
    console.log(orderItemResult);
    let orderItemsId = orderItemResult.map(item => item._id);
    console.log(orderItemsId);
    saveOrder.user = user._id;
    saveOrder.items = orderItemsId;
    saveOrder.count = items.length;
    saveOrder.total = total;
    // let result = saveOrder;
    let result = await saveOrder.save();
    Helper.fMsg(res,"Order Accepted",result)
}

const all = async(req,res,next)=>{
    let auth = req.user;
    let order = await DB.find({name:auth._id}).populate('items');
    if(order){
        Helper.fMsg(res,"All Orders",order);
    }else{
        next(new Error("Empty Orders"));
    }
}

module.exports ={
    add,
    all
}