const UserController = require('../controller/UserController')
const { verifyToken, isAdmin } = require('../middleware/verifyToken')
const router = require('express').Router()



router.get('/', [verifyToken, isAdmin], UserController.getAllUsers)
router.put('/update-user/', verifyToken, UserController.updateUser)
router.put('/update-user/:id', [verifyToken, isAdmin], UserController.updateUserByAdmin)
router.put('/cart', verifyToken, UserController.updateCart)
router.put('/delete-cart', verifyToken, UserController.deleteCart)
router.delete('/delete-user/:id', [verifyToken, isAdmin], UserController.deleteUserByAdmin)

module.exports = router