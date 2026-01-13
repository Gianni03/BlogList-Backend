const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)

  const user = new User({
    username: 'root',
    name: 'Superuser',
    passwordHash,
  })

  await user.save()
})
test('creation succeeds with a fresh username', async () => {
  const newUser = {
    username: 'gianni03',
    name: 'GianniP',
    password: 'secret1234'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    

  const users = await User.find({})
  assert.strictEqual(users.length, 2)
  
})

test('creation fails if username is missing', async () => {
  const newUser = {
    name: 'No Username',
    password: 'secret1234'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  const users = await User.find({})
  assert.strictEqual(users.length, 1)
})

test('creation fails if password is too short', async () => {
  const newUser = {
    username: 'ab',
    name: 'Short',
    password: '12'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  const users = await User.find({})
  assert.strictEqual(users.length, 1)
})

test('creation fails if username is not unique', async () => {
  const newUser = {
    username: 'gianni03',
    name: 'GianniP',
    password: 'secret1234'
  }

  await api.post('/api/users').send(newUser)

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  const users = await User.find({})
  assert.strictEqual(users.length, 1)
})

after(async () => {
  await mongoose.connection.close()
})
