const router= require('express').Router();
const controller = require('../controller/roleController');
const {validateBody, validateParma} = require('../utilies/validate');
const {PermitSchema,RoleAddPermit, AllSchema} = require('../utilies/schema')

router.post('/',[validateBody(PermitSchema.Add),controller.add]);
router.get('/',controller.get);
router.post('/Roleadd',[validateBody(RoleAddPermit.PermitAdd),controller.RoleAddPermit]);
router.post('/Roleremove',[validateBody(RoleAddPermit.PermitAdd),controller.RoleRemovePermit]);
router.route('/:id')
.get(controller.getOne)
.patch(validateParma(AllSchema.Id,'id'),controller.editRole)
.delete(validateParma(AllSchema.Id,'id'),controller.dropRole)

module.exports = router;