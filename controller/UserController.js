const User = require('../model/User')


class UserController {

    // [Get] / users/ 
    async getAllUsers(req, res) {
        try {
            const page = req.query.page
            const users = await User.find({}).select('-password -role')

            return res.status(200).json({ users })
        } catch (error) {
            return res.status(500).json({ error })
        }
    }


    //[PUT] /update-user
    async updateUser(req, res) {
        try {
            const { _id } = req.user

            if (Object.keys(req.body).length === 0) {
                return res.status(400).json('Missing inputs')
            }

            await User.findByIdAndUpdate(_id, req.body)
            res.status(200).json({ mess: 'update user successfully !' })

        } catch (error) {
            return res.status(500).json({ error })
        }
    }

    //[PUT] /update-user/:id
    async updateUserByAdmin(req, res) {
        try {
            if (Object.keys(req.body).length === 0) {
                return res.status(400).json('Missing inputs')
            }

            await User.findByIdAndUpdate(req.params.id, req.body)
            res.status(200).json({ mess: 'update user successfully !' })

        } catch (error) {
            return res.status(500).json({ error })
        }
    }

    // [DELETE]/delete/:id
    async deleteUserByAdmin(req, res) {
        try {
            await User.deleteOne({ _id: req.params.id })
            res.status(200).json({ mess: 'Delete user successfully !' })
        } catch (error) {
            return res.status(500).json({ error })
        }
    }

}

module.exports = new UserController