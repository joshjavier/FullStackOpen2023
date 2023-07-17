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

test('new blogs can be created via HTTP POST request', async () => {
  const newBlog = {
    title: 'A Firefox-only minimap',
    author: 'Stefan Judis',
    url: 'https://www.stefanjudis.com/a-firefox-only-minimap/',
    likes: 487,
  }

  const response = await api.post('/api/blogs').send(newBlog)

  expect(response.status).toEqual(201)
  expect(response.headers['content-type']).toMatch(/application\/json/)

  expect(response.body).toHaveProperty('title', newBlog.title)
  expect(response.body).toHaveProperty('author', newBlog.author)
  expect(response.body).toHaveProperty('url', newBlog.url)
  expect(response.body).toHaveProperty('likes', newBlog.likes)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
})

test('if new blog has no `likes` property, set the value to 0', async () => {
  const blogWithMissingLikes = {
    title: 'The Laptop to Buy',
    author: 'Andrew Brossia',
    url: 'https://blog.brossia.com/posts/the_laptop_to_buy/',
  }

  const response = await api.post('/api/blogs').send(blogWithMissingLikes)

  expect(response.status).toEqual(201)
  expect(response.headers['content-type']).toMatch(/application\/json/)
  expect(response.body).toHaveProperty('likes', 0)
})

afterAll(async () => {
  await mongoose.connection.close()
})
