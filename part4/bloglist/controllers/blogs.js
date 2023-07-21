const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', '-blogs')
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response, next) => {
  const { title, author, url, likes } = request.body

  try {
    const user = request.user
    const blog = new Blog({
      title,
      author: author || undefined,
      url,
      likes: likes || 0,
      user: user.id,
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog.id)
    await user.save()

    response.status(201).json(await savedBlog.populate('user', '-blogs'))
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {
  try {
    const user = request.user
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
    response.json(await updatedBlog.populate('user', '-blogs'))
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
