const User = require("../model/User")
const Order = require("../model/Order")
const Coupon = require("../model/Coupon")


class OrderController {

    async getOrders(req, res) {
        try {
            const order = await Order.find({})
            return res.status(200).json({ order })
        } catch (error) {
            return res.status(500).json({ mess: error })
        }
    }

    // Đơn hàng và tổng tiền
    //[POST] /
    async createOrder(req, res) {
        try {
            const { _id } = req.user
            const { coupon } = req.body

            const userCart = await User.findById({ _id }).select('cart').populate({ path: 'cart', select: 'title' })

            console.log(userCart)

            const products = userCart?.cart?.find(e => ({
                product: e.product,
                quatity: e.quatity,
                color: e.color
            }))
            let total = userCart?.cart?.reducer((sum, e) => sum + e.product.price * e.quatity, 0)
            const createData = {
                orderBy: _id,
                products,
                total
            }

            if (coupon) {
                const selectCoupon = await Coupon.findById(coupon)
                total = Math.round(total * ((1 - Number(selectCoupon?.disCount) / 100) / 1000) * 1000) || total

                createData.total = total
                createData.coupon = coupon
            }


            const order = await new Order(createData)
            await order.save()

            return res.status(200).json({ mess: 'Create successfully', order })

        } catch (error) {
            return res.status(500).json({ mess: error })
        }
    }


    //[PUT] /update-status
    // async updateStatus(req, res) {
    //     try {
    //         const { id } = req.params

    //         await Order.findById({ _id: id }, req.body)
    //         return res.status(200).json({ mess: 'Update successfully', category })
    //     } catch (error) {
    //         return res.status(500).json({ mess: error })
    //     }
    // }
}

module.exports = new OrderController

