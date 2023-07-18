const Blog = require('../models/blog')
const User = require('../models/user')
const { blogs } = require('./blogs_for_test')

const initialBlogs = blogs.map((blog) => ({
  title: blog.title,
  author: blog.author,
  url: blog.url,
  likes: blog.likes,
}))

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', url: 'doesntmatter' })
  await blog.save()
  await blog.deleteOne()

  return blog.id
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

module.exports = { initialBlogs, nonExistingId, blogsInDb, usersInDb }
