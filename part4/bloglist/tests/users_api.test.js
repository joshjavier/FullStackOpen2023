const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()
}, 10000)

describe('when there is initially one user in db', () => {
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    expect(usernames).toContain(newUser.username)
  })
})

test('get a list of all users in db', async () => {
  const response = await api.get('/api/users')

  expect(response.status).toEqual(200)
  expect(response.headers['content-type']).toMatch(/application\/json/)

  expect(response.body).toHaveLength(1)
})

describe('creating a user', () => {
  const userWithNoUsername = {
    password: 'secret',
    name: '007',
  }

  const userWithNoPassword = {
    username: 'nothingtohide',
    name: 'Bob',
  }

  const userWithShortUsername = {
    username: 'yo',
    password: 'sup',
  }

  const userWithShortPassword = {
    username: 'shawty',
    password: 'hi',
  }

  const userWithExistingUsername = {
    username: 'root',
    password: 'iamroot',
  }

  const userWithValidProps = {
    username: 'deku',
    password: 'allmight',
  }

  test('fails when username is missing', async () => {
    await api.post('/api/users').send(userWithNoUsername).expect(400)
  })

  test('fails when password is missing', async () => {
    await api.post('/api/users').send(userWithNoPassword).expect(400)
  })

  test('fails when username is less than 3 characters', async () => {
    await api.post('/api/users').send(userWithShortUsername).expect(400)
  })

  test('fails when password is less than 3 characters', async () => {
    const response = await api.post('/api/users').send(userWithShortPassword)

    expect(response.status).toEqual(400)
    expect(response.headers['content-type']).toMatch(/application\/json/)
    expect(response.body).toHaveProperty('error')
  })

  test('fails when username already exists in db', async () => {
    const response = await api.post('/api/users').send(userWithExistingUsername)

    expect(response.status).toEqual(400)
    expect(response.headers['content-type']).toMatch(/application\/json/)
    expect(response.body).toHaveProperty('error')
  })

  test('succeeds when all validations were passed', async () => {
    const usersAtStart = await helper.usersInDb()

    await api
      .post('/api/users')
      .send(userWithValidProps)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
