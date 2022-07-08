const router = require('express').Router();
const controller = require('../controller/userController');
const {validateBody,validateToken,validateRole} = require('../utilies/validate');
const {UserSchema} = require('../utilies/schema');

router.post('/register',[validateBody(UserSchema.Register),controller.register]);
router.post('/',[validateBody(UserSchema.login),controller.login]);
router.post('/add/role',[validateToken(),validateRole("Owner"),validateBody(UserSchema.userAddRole),controller.addRole]);
router.post('/remove/role',[validateToken(),validateRole("Owner"),validateBody(UserSchema.userAddRole),controller.removeRole]);
router.post('/add/permit',[validateToken(),validateRole("Owner"),validateBody(UserSchema.userAddPermit),controller.addPermit]);
router.post('/remove/permit',[validateToken(),validateRole("Owner"),validateBody(UserSchema.userAddPermit),controller.removePermit]);


module.exports = router;



