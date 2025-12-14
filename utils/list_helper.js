const _ = require('lodash')
const blog = require("../models/blog")

const dummy = (blogs) => 1

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
    
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  const favorite = blogs.reduce((prev, current) =>
    current.likes > prev.likes ? current : prev
  )

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  return _.chain(blogs)
    .groupBy('author')  
    .map((blogs, author) => ({
      author,
      blogs: blogs.length
    }))
    .maxBy('blogs')            
    .value()

}


const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  return _.chain(blogs)
    .groupBy('author')                    
    .map((blogs, author) => ({
      author,
      likes: _.sumBy(blogs, 'likes')   
    }))
    .maxBy('likes')   
    .value()

}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}