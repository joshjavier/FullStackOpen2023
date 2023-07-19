const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', '-blogs')
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  const { title, author, url, likes } = request.body

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
      title,
      author,
      url,
      likes: likes || 0,
      user: user.id,
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog.id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    // authentication
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    // get matching user
    const user = await User.findById(decodedToken.id)
    // get matching blog
    const blog = await Blog.findById(request.params.id)

    // return 404 if no matching blog is found in db
    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }

    // only delete if blog is created by the authenticated user
    if (blog.user?.toString() === user.id) {
      const removedBlog = await blog.deleteOne()

      // update the blogs array of the corresponding user in db
      user.blogs = user.blogs.filter(
        (blogId) => blogId.toString() !== removedBlog.id,
      )
      await user.save()

      return response.status(204).end()
    } else {
      return response
        .status(403)
        .json({ error: "you can't delete notes created by another user" })
    }
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true, runValidators: true, context: 'query' },
    )
    response.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
