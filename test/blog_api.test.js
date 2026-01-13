const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')

const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

describe('when there are initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, 2)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map(blog => blog.title)
    assert(titles.includes('React patterns'))
  })
})

describe('addition of a new blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Full Stack Open',
      author: 'University of Helsinki',
      url: 'https://fullstackopen.com/',
      likes: 10
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length + 1)

    const titles = response.body.map(b => b.title)
    assert(titles.includes('Full Stack Open'))
  })
})

describe('unique identifier property is named id', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body[0]

  assert(blogs.id)
  assert.strictEqual(blogs._id, undefined)
})

describe('default values', () => {
  test('if likes is missing, it defaults to 0', async () => {
    const newBlog = {
      title: 'No likes yet',
      author: 'Anonymous',
      url: 'https://example.com/no-likes'
      // 👈 likes NO está
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
  })
})

describe('missing required fields', () => {
  test('blog without title is not added', async () => {
    const newBlog = {
      author: 'No Title',
      url: 'https://example.com/no-title',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

  test('blog without url is not added', async () => {
    const newBlog = {
      title: 'No URL',
      author: 'No URL Author',
      likes: 3
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})

describe('deletion of a blog', () => {
  test('a blog can be deleted', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert(!titles.includes(blogToDelete.title))
  })
})

describe('updating a blog', () => {
  test('likes can be updated', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      ...blogToUpdate.toJSON(),
      likes: blogToUpdate.likes + 1
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
  })
})



after(async () => {
  await mongoose.connection.close()
})
