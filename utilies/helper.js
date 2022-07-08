const bcrypt = require('bcryptjs');
const Redis = require('async-redis').createClient();
const jwt = require('jsonwebtoken');
module.exports = { 
    fMsg : async(res,msg="",result=[]) => res.status(200).json({res:true,msg,result}),
    encode : (payload) => bcrypt.hashSync(payload),
    comparePs : (plain,hash) =>bcrypt.compareSync(plain,hash),
    set: async (id, value) => await Redis.set(id.toString(), JSON.stringify(value)),
   get: async (id) => JSON.parse(await Redis.get(id.toString())),
    drop : async(id) => await Redis.delete(id.toString()),
    makeToken : (payload) => jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:'1hr'}),
}