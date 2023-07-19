const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

beforeAll(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('hailhydra', 10)
  const user = new User({
    username: 'captainamerica',
    passwordHash,
    name: 'Steve Rogers',
  })

  await user.save()
}, 15000)

describe('logging in', () => {
  test("fails when user doesn't exist in db", async () => {
    const login = {
      username: 'bucky',
      password: 'wintersoldier',
    }

    await api.post('/api/login').send(login).expect(401)
  })

  test("fails when password isn't correct", async () => {
    const login = {
      username: 'captainamerica',
      password: 'iamironman',
    }

    await api.post('/api/login').send(login).expect(401)
  })

  test('succeeds when user exists in db and password is correct', async () => {
    const login = {
      username: 'captainamerica',
      password: 'hailhydra',
    }

    const response = await api.post('/api/login').send(login)

    expect(response.status).toEqual(200)
    expect(response.headers['content-type']).toMatch(/application\/json/)

    expect(response.body).toHaveProperty('token')
    expect(response.body).toHaveProperty('username', login.username)
    expect(response.body).toHaveProperty('name')
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
