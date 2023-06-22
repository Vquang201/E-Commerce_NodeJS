const ProductController = require('../controller/ProductController')
const { verifyToken, isAdmin } = require('../middleware/verifyToken')
const router = require('express').Router()

router.get('/', [verifyToken, isAdmin], ProductController.getAllProducts)
router.post('/create-product', [verifyToken, isAdmin], ProductController.createProduct)
router.put('/update-product/:id', [verifyToken, isAdmin], ProductController.updateProduct)
router.delete('/delete-product/:id', [verifyToken, isAdmin], ProductController.deleteProduct)
router.put('/rating-product', verifyToken, ProductController.rateProduct)


module.exports = router