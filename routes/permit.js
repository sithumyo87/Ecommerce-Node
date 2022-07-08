const router = require('express').Router();
const controller = require('../controller/permitController');
const {PermitSchema} = require('../utilies/schema');
const {validateBody, validateParma,validateToken} = require('../utilies/validate')

router.post('/',[validateToken(),validateBody(PermitSchema.Add),controller.add]);
router.get('/',controller.all);
router.route('/:id')
        .get(validateParma(PermitSchema.Id,"id"),controller.get)
        .patch(validateParma(PermitSchema.Id,"id"),controller.putch)
        .delete(validateParma(PermitSchema.Id,"id"),controller.deletePer);

module.exports = router;