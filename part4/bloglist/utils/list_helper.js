const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  const mostLikes = blogs.reduce(
    (top, blog) => (top > blog.likes ? top : blog.likes),
    0,
  )

  return blogs.find((blog) => blog.likes === mostLikes)
}

const mostBlogs = (blogs) => {
  const authorsBlogs = _.transform(
    _.countBy(blogs, 'author'),
    (result, blogs, author) => {
      result.push({ author, blogs })
    },
    [],
  )

  return _.maxBy(authorsBlogs, 'blogs')
}

const mostLikes = (blogs) => {
  const authorsLikes = _.transform(
    _.groupBy(blogs, 'author'),
    (result, blogs, author) => {
      const likes = blogs.reduce((sum, blog) => sum + blog.likes, 0)
      result.push({ author, likes })
    },
    [],
  )

  return _.maxBy(authorsLikes, 'likes')
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
