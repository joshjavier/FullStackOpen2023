const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs.map((blogObj) => new Blog(blogObj))
  const promiseArray = blogObjects.map((blog) => blog.save())

  await Promise.all(promiseArray)
})

test('all blogs are returned in JSON format', async () => {
  const response = await api.get('/api/blogs')

  expect(response.headers['content-type']).toMatch(/application\/json/)
  expect(response.status).toEqual(200)
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('unique identifier property of blog posts is named `id`', async () => {
  const blogs = await helper.blogsInDb()

  return blogs.every((blog) => expect(blog).toHaveProperty('id'))
})

afterAll(async () => {
  await mongoose.connection.close()
})
