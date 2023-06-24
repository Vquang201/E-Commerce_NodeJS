const { model } = require("mongoose")

class OrderController {

    async createOrder(req, res) {
        try {
            const { _id } = req.user

            if (Object.keys(req.body).length === 0) {
                return res.status(400).json('Missing inputs')
            }


            return res.status(200).json({ mess: 'Create successfully', category })

        } catch (error) {
            return res.status(500).json({ mess: error })
        }
    }
}

model.export = new OrderController

