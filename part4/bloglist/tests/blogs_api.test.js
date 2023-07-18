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
}, 10000)

describe('when there are initially some notes saved', () => {
  test('blogs are returned in JSON format', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('the unique identifier prop of all blogs is named `id`', async () => {
    const blogs = await helper.blogsInDb()

    return blogs.every((blog) => expect(blog).toHaveProperty('id'))
  })
})

describe('adding a new blog', () => {
  test('succeeds with valid data', async () => {
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

  test('without the `likes` prop will have it initially set to 0', async () => {
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

  test('fails if the `title` prop is missing', async () => {
    const blogWithMissingTitle = {
      author: 'Marin Cogan',
      url: 'https://www.vox.com/23712664/parking-lots-urban-planning-cities-housing',
      likes: 99,
    }

    const response = await api.post('/api/blogs').send(blogWithMissingTitle)

    expect(response.status).toEqual(400)
  })

  test('fails if the `url` prop is mising', async () => {
    const blogWithMissingUrl = {
      title: '‘The Man Who Organized Nature’ Review: Linnaeus the Namer',
      author: 'Christoph Irmscher',
      likes: 10,
    }

    const response = await api.post('/api/blogs').send(blogWithMissingUrl)

    expect(response.status).toEqual(400)
  })
})

describe('deleting a blog', () => {
  test('succeeds if id is valid and currently exists', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const validId = blogsAtStart[0].id

    await api.delete(`/api/blogs/${validId}`).expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
  })

  test("returns 204 if id is valid and currently doesn't exist", async () => {
    const nonExistingId = await helper.nonExistingId()

    await api.delete(`/api/blogs/${nonExistingId}`).expect(204)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})