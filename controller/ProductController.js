const slugify = require('slugify')
const Product = require('../model/Product')
require('dotenv').config()

class ProductController {

    // [GET] / 
    async getAllProducts(req, res) {
        try {
            const queries = { ...req.query }
            const sort = req.query.sort
            let product

            //PAGINATION
            const page = req.query.page
            const limit = process.env.LIMIT
            const skip = (page * limit) - limit


            // Trừ 2 query page và sort
            const excludedFields = ['page', 'sort']
            excludedFields.forEach(el => delete queries[el])
            let queryString = JSON.stringify(queries)
            queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
            const queryObject = JSON.parse(queryString)

            // filter price
            if (queryObject) {
                product = await Product.find(queryObject).skip(skip).limit(limit)
            }

            // sort title
            if (sort) {
                product = await Product.find(queryObject).sort(sort).skip(skip).limit(limit)
            }

            res.status(200).json({
                record: product.length,
                page: page,
                mess: product
            })

        } catch (error) {
            return res.status(500).json({ mess: error })
        }
    }

    //[POST] /create-product
    async createProduct(req, res) {
        try {
            if (Object.keys(req.body).length === 0) {
                return res.status(400).json({ mess: 'Missing Inputs' })
            }

            if (req.body.title) {
                req.body.slug = slugify(req.body.title)
            }

            const product = await new Product(req.body)
            await product.save()
            res.status(200).json(product)

        } catch (error) {
            return res.status(500).json({ mess: error })
        }
    }

    // [PUT] /update-product/:id
    async updateProduct(req, res) {
        try {
            if (Object.keys(req.body).length === 0) {
                return res.status(400).json({ mess: 'Missing Inputs' })
            }

            if (req.body.title) {
                req.body.slug = slugify(req.body.title)
            }

            await Product.findByIdAndUpdate({ _id: req.params.id }, req.body)
            res.status(200).json({ mess: 'update successfully' })

            // await 

        } catch (error) {
            return res.status(500).json({ mess: error })
        }
    }

    // [DELETE] /delete-product/:id
    async deleteProduct(req, res) {
        try {
            await Product.deleteOne({ _id: req.params.id })
            res.status(200).json({ mess: 'delete successfully' })

        } catch (error) {
            return res.status(500).json({ mess: error })
        }
    }

    async rateProduct(req, res) {
        try {
            const { postId, star, comment } = req.body
            const { _id } = req.user


            const product = await Product.findById({ _id: postId })
            console.log(_id);
            const readyRating = product?.ratings?.find(e => e?.postedBy.toString() === _id)
            console.log(readyRating)


            if (readyRating) {
                // Update star and comment
                await Product.updateOne(
                    { ratings: { $elemMatch: readyRating } },
                    // { $set: { "ratings.$.star": star, "ratings.$.comment": comment } }
                    { $set: { ratings: { postedBy: _id, star, comment } } }
                )
            } else {
                // add new star and comment
                await Product.findByIdAndUpdate(
                    postId,
                    { $push: { ratings: { postedBy: _id, star, comment } } }
                )
            }




            res.status(200).json({
                mess: 'rating successfully !!'
            })

        } catch (error) {
            return res.status(500).json({ mess: error })
        }
    }
}

module.exports = new ProductController