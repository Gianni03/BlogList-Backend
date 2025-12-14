const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
})

describe('favorite blog', () => {
  const blogs = [
    {
      title: 'A',
      author: 'Author 1',
      likes: 5
    },
    {
      title: 'B',
      author: 'Author 2',
      likes: 12
    },
    {
      title: 'C',
      author: 'Author 3',
      likes: 7
    }
  ]

  test('returns blog with most likes', () => {
    const result = listHelper.favoriteBlog(blogs)

    assert.deepStrictEqual(result, {
      title: 'B',
      author: 'Author 2',
      likes: 12
    })
  })
})

describe('most blogs', () => {
  const blogs = [
    { author: 'A', likes: 1 },
    { author: 'A', likes: 2 },
    { author: 'B', likes: 5 }
  ]

  test('author with most blogs', () => {
    const result = listHelper.mostBlogs(blogs)

    assert.deepStrictEqual(result, {
      author: 'A',
      blogs: 2
    })
  })
})

describe('most likes', () => {
  const blogs = [
    { author: 'A', likes: 5 },
    { author: 'A', likes: 7 },
    { author: 'B', likes: 10 }
  ]

  test('author with most likes', () => {
    const result = listHelper.mostLikes(blogs)

    assert.deepStrictEqual(result, {
      author: 'A',
      likes: 12
    })
  })
})