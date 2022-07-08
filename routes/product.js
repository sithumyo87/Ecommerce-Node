const router= require('express').Router();
const controller = require('../controller/productController');
const {imageUploads} = require('../utilies/gallery')


router.post('/',[imageUploads,controller.add]);
router.get('/paginate/:page',controller.paginate);
router.get('/paginate/:type/:page/:id',controller.filterByType);

router.route('/:id')
.get(controller.get)
.patch([controller.patch])
.delete(controller.drop)

module.exports = router;