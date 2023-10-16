const ProductController = require('../controller/ProductController')
const uploadCloudinary = require('../middleware/uploader')
const { verifyToken, isAdmin } = require('../middleware/verifyToken')
const router = require('express').Router()

router.get('/', ProductController.getAllProducts)
router.post('/create-product', [verifyToken, uploadCloudinary.single('image')], ProductController.createProduct)
router.put('/update-product/:id', [verifyToken, isAdmin, uploadCloudinary.single('image')], ProductController.updateProduct)
router.delete('/delete-product/:id', [verifyToken, isAdmin], ProductController.deleteProduct)
router.put('/rating-product', verifyToken, ProductController.rateProduct)


module.exports = router