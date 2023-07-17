const Blog = require('../models/blog')
const { blogs } = require('./blogs_for_test')

const initialBlogs = blogs.map((blog) => ({
  title: blog.title,
  author: blog.author,
  url: blog.url,
  likes: blog.likes,
}))

const nonExistingId = async () => {
  const blog = new Blog({ name: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

module.exports = { initialBlogs, nonExistingId, blogsInDb }
