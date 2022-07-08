const DB = require('../models/user');
const RoleDB = require('../models/role');
const Helper = require('../utilies/helper');
const PermitDB = require('../models/permit');

const register = async(req,res,next) => {
    let userEmail = await DB.findOne({email:req.body.email});
    if(userEmail){
        next(new Error("Creditial Wrong!!"));
        return;
    }

    let userPhone = await DB.findOne({phone:req.body.phone});
    if(userPhone){
        next(new Error("Creditial Wrong!!"));
        return;
    }

    req.body.password = Helper.encode(req.body.password);
    let result = await new DB(req.body).save();
    Helper.fMsg(res,"Register Completed",result);
}

// const login = async(req,res,next)=>{
//     let userEmail = await DB.findOne({email:req.body.email}).populate('permits roles').select('-__v');
//     // console.log(userEmail);
//     if(userEmail){
//         if(Helper.comparePs(req.body.password,userEmail.password)){
//             let user = userEmail.toObject();
//             delete user.password;
//             user.token = Helper.makeToken(user);
//             Helper.set(user._id,user);
//             Helper.fMsg(res,"Login Successful",user);
//         }else{
//             next(new Error("Wrong Creditial!!"));
//         }
//     }else{
//         next(new Error("Wrong Creditial!!"));
//     } 
// }

// const userAddRole = async(req,res,next)=>{
//     let userId = await DB.findById(req.body.userId);
//     let roleId = await roleDB.findById(req.body.roleId);
//     console.log(userId);
//     console.log(roleId); 

//     // await DB.findByIdAndUpdate(userId._id,{$push:{roles:roleId._id}});
//     // let result = await DB.findById(req.body.userId);
//     // Helper.fMsg(res,"User Add ROle",result);
// }

const login = async (req, res, next) => {
    let dbUser = await DB.findOne({ phone: req.body.phone }).populate('roles permits').select('-__v');
    if (dbUser) {
       if (Helper.comparePs(req.body.password, dbUser.password)) {
          let user = dbUser.toObject();
          delete user.password;
          user.token = Helper.makeToken(user);
          Helper.set(user._id, user);
          Helper.fMsg(res, "Login Success", user);
       } else {
          next(new Error("Creditial Error"));
       }
    } else {
       next(new Error("Creditial Error"));
    }
 }
 
 const addRole = async (req, res, next) => {
    let dbUser = await DB.findById(req.body.userId);
    let dbRole = await RoleDB.findById(req.body.roleId);
    // console.log(userdb);
    // console.log(dbRole);
    let foundRole = dbUser.roles.find(rid => rid.equals(dbRole._id));
    if (foundRole) {
       next(new Error("Role already exist"));
    } else {
       await DB.findByIdAndUpdate(dbUser._id, { $push: { roles: dbRole._id } });
       let user = await DB.findById(dbUser._id);
       Helper.fMsg(res, "Added Role to User", user);
    }
 }

 const removeRole = async(req,res,next) =>{
    let userdb= await DB.findById(req.body.userId);
    
    let foundRole = userdb.roles.find(rid => rid.equals(req.body._id));
    if(foundRole){
        await DB.findByIdAndUpdate(userdb._id,{$pull:{roles:roledb._id}});
        let result = await DB.findById(req.body.userId); 
        Helper.fMsg(res, "Added Role to User", result);
    }else{
        next(new Error("doesn't exsit role"));
    }
 }

 const addPermit = async(req,res,next) => {
    let userDB = await DB.findById(req.body.userId);
    let permitdb = await PermitDB.findById(req.body.permitId);
    
    let foundPermit = userDB.permits.find(pid => pid.equals(permitdb._id));
    if(foundPermit){
       next(new Error("Already Exists Permit"));
    }else{
        await DB.findByIdAndUpdate(userDB._id,{$push : {permits:permitdb._id}});
        let result = await DB.findById(req.body.userId);
        Helper.fMsg(res,"User Add Permit",result);
    }
 }

 const removePermit = async(req,res,next)=> {
    let userDB = await DB.findById(req.body.userId);

    let foundPermit = await userDB.permits.find(pid => pid.equals(req.body.permitId));
    if(foundPermit){
        await DB.findByIdAndUpdate(userDB._id,{$pull:{permits:req.body.permitId}});
        let result = await DB.findById(req.body.userId);
        Helper.fMsg(res,"Removed Permit",result);
    }else{
        next(new Error("Nothing here to remove permit"));
    }
 }

module.exports ={
    register,
    login,
    addRole,
    removeRole,
    addPermit,
    removePermit
}