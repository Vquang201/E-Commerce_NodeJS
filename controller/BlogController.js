const Blog = require('../model/Blog')
const User = require('../model/User')

class BlogController {

    //[GET] /blogs/
    async getBlogs(req, res) {
        try {
            const blog = await Blog.find()
            res.status(200).json({ blog })
        } catch (error) {
            res.status(500).json({ mess: error })
        }
    }

    async getBlog(req, res) {
        try {
            const blogId = req.params.id

            const blog = await Blog.findByIdAndUpdate({ _id: blogId }, { $inc: { numberViews: 1 } })
                .populate({ path: 'likes', select: 'lastname' })
                .populate({ path: 'disLikes', select: 'lastname' })

            res.status(200).json({ blog })
        } catch (error) {
            res.status(500).json({ mess: error })
        }
    }

    //[GET] /blogs/get-view/:id
    async getViewBlog(req, res) {
        // inc view
        try {
            //Gọi API => numberView + 1
            const blog = await Blog.findByIdAndUpdate(
                { _id: req.params.id },
                { $inc: { numberViews: 1 } }
            )

            res.status(200).json({ blog })
        } catch (error) {
            res.status(500).json({ mess: error })
        }
    }


    //[POST] /blogs/create-blog
    async createBlog(req, res) {
        try {
            console.log(req.body);
            if (Object.keys(req.body).length === 0) {
                if (req.file) {
                    cloudinary.uploader.destroy(req.file.filename, (err, result) => {
                        if (err) {
                            console.log({ err: err })
                        }
                    })
                }
                return res.status(400).json('Missing inputs')
            }

            if (req.file) {
                req.body.image = req.file.path
            }

            const blog = new Blog(req.body)
            await blog.save()

            return res.status(200).json({ mess: 'Create successfully', blog })

        } catch (error) {
            if (req.file) {
                cloudinary.uploader.destroy(req.file.filename, (err, result) => {
                    if (err) {
                        console.log({ err: err })
                    }
                })
            }
            return res.status(500).json({ mess: error })
        }
    }

    //[PUT]/blogs//update-blog/:id
    async updateBlog(req, res) {
        try {
            const { id } = req.params
            if (Object.keys(req.body).length === 0 && !req.file) {

                cloudinary.uploader.destroy(req.file.filename, (err, result) => {
                    if (err) {
                        console.log({ err: err })
                    }
                })

                return res.status(400).json('Missing inputs')
            }

            if (req.file) {
                req.body.image = req.file.path
            }

            await Blog.findByIdAndUpdate({ _id: req.params.id }, req.body)

            res.status(200).json({ mess: 'Update successfully' })
        } catch (error) {
            if (req.file) {
                cloudinary.uploader.destroy(req.file.filename, (err, result) => {
                    if (err) {
                        console.log({ err: err })
                    }
                })
            }
            res.status(500).json({ mess: error })
        }
    }

    //[DELETE] /blogs/delete-blog/:id
    async deleteBlog(req, res) {
        try {
            await Blog.findByIdAndDelete(req.params.id)

            res.status(200).json({ mess: 'Delete successfully' })
        } catch (error) {
            res.status(500).json({ mess: error })
        }
    }

    //[POST] /blogs/like-blog
    async likeBlog(req, res) {
        try {
            const { blogId } = req.body
            const { _id } = req.user
            console.log(_id);
            const blog = await Blog.findById({ _id: blogId })

            //check user đã like hay chưa 
            const userLiked = blog?.likes.find(e => e.toString() === _id)
            //check user disliked hay chưa
            const userDisliked = blog?.disLikes.find(e => e.toString() === _id)


            if (userDisliked) {
                // Nếu có dislike thì hủy dislike => like
                await Blog.findByIdAndUpdate(blogId, { $pull: { disLikes: _id } })
            }

            if (userLiked) {
                // Hủy like
                await Blog.findByIdAndUpdate(blogId, { $pull: { likes: _id } })
                // xóa history like của user
                await User.findByIdAndUpdate({ _id }, { $pull: { historyLiked: { blogId } } })
            } else {
                // thêm like
                await Blog.findByIdAndUpdate(blogId, { $push: { likes: _id } })
                // thêm vào history like của user
                await User.findByIdAndUpdate({ _id }, { $push: { historyLiked: { blogId } } })
            }

            res.status(200).json({ mess: 'Like successfully' })
        } catch (error) {
            res.status(500).json({ mess: error })
        }
    }

    //[POST] /blogs/dislike-blog
    async disLikeBlog(req, res) {
        try {
            const { blogId } = req.body
            const { _id } = req.user
            const blog = await Blog.findById({ _id: blogId })

            //check user đã like hay chưa 
            const userLiked = blog?.likes.find(e => e.toString() === _id)
            //check user disliked hay chưa
            const userDisliked = blog?.disLikes.find(e => e.toString() === _id)

            if (userLiked) {
                // hủy like rồi mới dislike
                await Blog.findByIdAndUpdate(blogId, { $pull: { likes: _id } })
            }

            if (userDisliked) {
                // Hủy dislike
                await Blog.findByIdAndUpdate(blogId, { $pull: { disLikes: _id } })
            } else {
                // thêm dislike
                await Blog.findByIdAndUpdate(blogId, { $push: { disLikes: _id } })
            }


            res.status(200).json({ mess: 'Dislike successfully' })
        } catch (error) {
            res.status(500).json({ mess: error })
        }
    }

    // [POST]/blogs/comment-blog
    async commentBlog(req, res) {
        try {
            const { bid, comment } = req.body
            const { _id } = req.user

            await Blog.findByIdAndUpdate(
                { _id: bid },
                { $push: { comments: { userId: _id, content: comment } } }
            )

            res.status(200).json({ mess: 'comment successfully!!' })
        } catch (error) {
            res.status(500).json({ mess: error })
        }
    }

}

module.exports = new BlogController