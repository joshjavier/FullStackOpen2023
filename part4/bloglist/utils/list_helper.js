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

module.exports = { dummy, totalLikes, favoriteBlog }
