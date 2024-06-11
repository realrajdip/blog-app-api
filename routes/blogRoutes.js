const express = require('express')
const router = express.Router()
const { getBlogs, postBlog, getBlog, deleteBlog} = require('../controllers/blogControllers')
const { protect } = require('../middleware/authMiddleware')


router.route('/').get(getBlogs).post(protect, postBlog)
router.route('/:id').get(protect, getBlog).delete(protect, deleteBlog)


module.exports = router