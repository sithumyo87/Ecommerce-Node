const jwt = require("jsonwebtoken");
const helper = require("./helper");

module.exports = {
  validateBody: (Schema) => {
    return (req, res, next) => {
      const result = Schema.validate(req.body);
      if (result.error) {
        next(new Error(result.error.details[0].message));
      } else {
        next();
      }
    };
  },
  validateParma: (Schema, name) => {
    return (req, res, next) => {
      let obj = {};
      obj[`${name}`] = req.params[`${name}`];
      let result = Schema.validate(obj);
      if (result.error) {
        next(new Error(result.error.details[0].message));
      } else {
        next();
      }
    };
  },
  validateToken: () => {
    return async (req, res, next) => {
      if(!req.headers.authorization){
        next(new Error("Tokenization Error"));
        return;
      }
      let token = req.headers.authorization.split(" ")[1];
     try{
      if(token){
        let decode = jwt.verify(token, process.env.SECRET_KEY);
        if (decode) {
          // console.log(decode);
          let user = await helper.get(decode._id);
          // console.log(req.user);
          if (user) {
            req.user = user;
            // console.log(req.user.name);
            next();
          } else {
            next(new Error("Tokenization Error"));
          }
        } else {
          next(new Error("Tokenization Error"));
        }
      }else{
        next(new Error("Tokenization Error"));
      };
     }catch{
      next(new Error("Tokenization Error"));
    }
    };
    //    console.log("Hello");
  },
  validateRole: (role) => {
    return async (req, res, next) => {
       let foundRole = await req.user.roles.find(ro => ro.name == role);
      //  console.log(foundRole);
       if (foundRole) {
          next();
       } else {
          next(new Error("You don't have this permission"));
       }
    }
 },
 AnyRole: (role) => {
    return async(req,res,next) => {
      let bol = false;
      for(i = 0;i < role.length;i++){
        let roles = req.user.roles.find(rid => rid.name == role[i]);
        bol = true;
        break;
      }
      if(bol) next();
      else next(new Error("Your roles are not allowed"));
    }
 },

 AnyPermit : (permit) =>{
  return async(req,res,next) => {
    let bol = false;
    for(i=0;i< permit.length;i++){
      let ss =req.user.permits.find(pid => pid.name == permit[i]);
      console.log(ss);
      bol = true;
      break;
    }
    if(bol) next();
    else next(new Error("Your Permits are not allowed in AnyPermit Validation"))
  }
 }
};
