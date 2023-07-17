const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const { blogs } = require('./blogs_for_test')

const api = supertest(app)

const initialBlogs = blogs.map((blog) => ({
  title: blog.title,
  author: blog.author,
  url: blog.url,
  likes: blog.likes,
}))

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = initialBlogs.map((blogObj) => new Blog(blogObj))
  const promiseArray = blogObjects.map((blog) => blog.save())

  await Promise.all(promiseArray)
})

test('all blogs are returned in JSON format', async () => {
  const response = await api.get('/api/blogs')

  expect(response.headers['content-type']).toMatch(/application\/json/)
  expect(response.status).toEqual(200)
  expect(response.body).toHaveLength(initialBlogs.length)
})

afterAll(async () => {
  await mongoose.connection.close()
})
