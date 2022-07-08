const helper = require('../utilies/helper');
const DB = require('../models/user');
const roleDB = require('../models/role');
const permitDB = require('../models/permit');
let fs = require('fs');

const migrate = async() =>{
    let data = fs.readFileSync('./migrations/users.json');
    let users = JSON.parse(data);
    // user.password = helper.Hashps(user.password);
    // console.log(user);
    users.forEach(async(user) => {
        user.password = helper.encode(user.password);
        let result = await new DB(user).save();
        console.log(result);
    });
}   
const rpmigrate = async() =>{
    let data = fs.readFileSync('./migrations/rpmigrate.json');
    let rp = JSON.parse(data);
    // console.log(rp);

    rp.roles.forEach(async(role) => {
        let result = await new roleDB(role).save();
        console.log(result);
    });

    rp.permits.forEach(async(permit) => {
        let result = await new permitDB(permit).save();
        console.log(result);
    });


}

const userRole = async() => {
    let userDb = await DB.findOne({phone:"123123123"});
    let role = await roleDB.findOne({name:"Owner"});
    // console.log(role);
    await DB.findByIdAndUpdate(userDb._id,{$push:{roles:role._id}})
}
const backup = async()=>{
    let result = await DB.find();
    fs.writeFileSync('./migrations/backup/users.json',JSON.stringify(result));
}

module.exports = {
    migrate,
    backup,
    rpmigrate,
    userRole,
}