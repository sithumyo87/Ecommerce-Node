const router = require('express').Router();
const controller = require('../controller/orderController');
const {validateToken} = require('../utilies/validate')

router.post('/',validateToken(),controller.add);
router.get('/my',validateToken(),controller.all);
// router.route('/:id')
//         .get(controller.get)
//         .patch(controller.patch)
//         .delete(controller.drop);

module.exports = router;