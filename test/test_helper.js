const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const loginAndGetToken = async () => {
  const response = await api
    .post('/api/login')
    .send({
      username: 'root',
      password: 'sekret'
    })

  return response.body.token
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  loginAndGetToken,
  blogsInDb
}
