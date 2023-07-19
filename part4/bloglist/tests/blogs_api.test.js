const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

let token

beforeAll(async () => {
  await User.deleteMany({})

  // create a test user
  const username = 'test'
  const password = 'welcome123'
  const passwordHash = await bcrypt.hash(password, 10)
  const user = new User({ username, passwordHash })
  await user.save()

  // get a valid auth token
  const login = { username, password }
  const response = await api.post('/api/login').send(login)
  token = response.body.token
}, 10000)

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
  const blogWithValidData = {
    title: 'A Firefox-only minimap',
    author: 'Stefan Judis',
    url: 'https://www.stefanjudis.com/a-firefox-only-minimap/',
    likes: 487,
  }

  const blogWithMissingAuthor = {
    title: 'Untitled blog',
    url: 'https://www.untitledblog.co.uk/',
  }

  const blogWithMissingLikes = {
    title: 'The Laptop to Buy',
    author: 'Andrew Brossia',
    url: 'https://blog.brossia.com/posts/the_laptop_to_buy/',
  }

  const blogWithMissingTitle = {
    author: 'Marin Cogan',
    url: 'https://www.vox.com/23712664/parking-lots-urban-planning-cities-housing',
    likes: 99,
  }

  const blogWithMissingUrl = {
    title: '‘The Man Who Organized Nature’ Review: Linnaeus the Namer',
    author: 'Christoph Irmscher',
    likes: 10,
  }

  test('succeeds with valid data', async () => {
    const response = await api
      .post('/api/blogs')
      .auth(token, { type: 'bearer' })
      .send(blogWithValidData)

    expect(response.status).toEqual(201)
    expect(response.headers['content-type']).toMatch(/application\/json/)

    expect(response.body).toHaveProperty('title', blogWithValidData.title)
    expect(response.body).toHaveProperty('author', blogWithValidData.author)
    expect(response.body).toHaveProperty('url', blogWithValidData.url)
    expect(response.body).toHaveProperty('likes', blogWithValidData.likes)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  })

  test('succeeds even if author is missing', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const response = await api
      .post('/api/blogs')
      .auth(token, { type: 'bearer' })
      .send(blogWithMissingAuthor)

    expect(response.status).toEqual(201)
    expect(response.headers['content-type']).toMatch(/application\/json/)
    expect(response.body).not.toHaveProperty('author')

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)
  })

  test('without likes will have it initially set to 0', async () => {
    const response = await api
      .post('/api/blogs')
      .auth(token, { type: 'bearer' })
      .send(blogWithMissingLikes)

    expect(response.status).toEqual(201)
    expect(response.headers['content-type']).toMatch(/application\/json/)
    expect(response.body).toHaveProperty('likes', 0)
  })

  test('fails if title is missing', async () => {
    await api
      .post('/api/blogs')
      .auth(token, { type: 'bearer' })
      .send(blogWithMissingTitle)
      .expect(400)
  })

  test('fails if url is mising', async () => {
    await api
      .post('/api/blogs')
      .auth(token, { type: 'bearer' })
      .send(blogWithMissingUrl)
      .expect(400)
  })

  test('fails if token is invalid or missing', async () => {
    await api.post('/api/blogs').send(blogWithValidData).expect(401)
  })
})

describe('deleting a blog', () => {
  test('succeeds if id is valid and currently exists', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const validId = blogsAtStart[0].id

    await api.delete(`/api/blogs/${validId}`).expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
  })

  test("returns 204 if id is valid and currently doesn't exist", async () => {
    const nonExistingId = await helper.nonExistingId()

    await api.delete(`/api/blogs/${nonExistingId}`).expect(204)
  })
})

describe('updating a blog', () => {
  test("doesn't change the length of the database", async () => {
    const blogsAtStart = await helper.blogsInDb()
    const id = blogsAtStart[4].id

    const updatedProps = { title: 'TDD Harms Architecture' }

    await api
      .put(`/api/blogs/${id}`)
      .send(updatedProps)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })

  test('succeeds when changing title and author with a valid string', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const id = blogsAtStart[4].id

    const updatedProps = {
      title: 'TDD Harms Architecture',
      author: 'Uncle Bob',
    }

    const response = await api.put(`/api/blogs/${id}`).send(updatedProps)

    expect(response.status).toEqual(200)
    expect(response.headers['content-type']).toMatch(/application\/json/)

    expect(response.body).toHaveProperty('id', id)
    expect(response.body).toHaveProperty('title', 'TDD Harms Architecture')
    expect(response.body).toHaveProperty('author', 'Uncle Bob')
  })

  test('succeeds when updating the number of likes', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blog = blogsAtStart[4]

    const updatedProps = { likes: blog.likes + 1 }

    const response = await api.put(`/api/blogs/${blog.id}`).send(updatedProps)

    expect(response.status).toEqual(200)
    expect(response.headers['content-type']).toMatch(/application\/json/)

    expect(response.body).toHaveProperty('id', blog.id)
    expect(response.body).toHaveProperty('title', blog.title)
    expect(response.body).toHaveProperty('author', blog.author)
    expect(response.body).toHaveProperty('likes', updatedProps.likes)
  })

  test('fails if data is missing title or url', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const id = blogsAtStart[4].id

    const updatedProps = { url: '' }

    await api.put(`/api/blogs/${id}`).send(updatedProps).expect(400)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
