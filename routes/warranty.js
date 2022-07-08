const router= require('express').Router();
const controller = require('../controller/warrantyController');
const {imageUpload} = require('../utilies/gallery');


router.post('/',[imageUpload,controller.add]);
router.get('/',controller.all);

router.route('/:id')
.get(controller.get)
.patch([imageUpload,controller.patch])
.delete(controller.drop)

module.exports = router;