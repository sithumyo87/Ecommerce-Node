const Joi = require('joi');

module.exports = {
    UserSchema :{
        Register:Joi.object({
            name:Joi.string().required(),
            email:Joi.string().email().required(),
            phone:Joi.string().min(7).max(11).required(),
            password:Joi.string().min(5).required(),
        }),
        login:Joi.object({
            phone:Joi.string().required(),
            password:Joi.string().min(5).required(),
        }),
        userAddRole:Joi.object({
            roleId:Joi.string().regex(/^[A-Fa-f0-9]{24}$/),
            userId:Joi.string().regex(/^[A-Fa-f0-9]{24}$/)
        }),
        userAddPermit:Joi.object({
            permitId:Joi.string().regex(/^[A-Fa-f0-9]{24}$/),
            userId:Joi.string().regex(/^[A-Fa-f0-9]{24}$/)
        })
    },
    PermitSchema : {
        Add : Joi.object({
            name:Joi.string().required(),
        })
    },
    RoleAddPermit:{
        PermitAdd: Joi.object({
            roleId:Joi.string().regex(/^[A-Fa-f0-9]{24}$/),
            permitId:Joi.string().regex(/^[A-Fa-f0-9]{24}$/)
        }),
    },
    AllSchema:{
        Id:Joi.object({
            id:Joi.string().regex(/^[A-Fa-f0-9]{24}$/)
        }),
        
        
    }
}