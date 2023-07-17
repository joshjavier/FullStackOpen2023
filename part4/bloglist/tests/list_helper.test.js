const listHelper = require('../utils/list_helper')
const {
  blogs,
  listWithOneBlog,
  listWithManyTopFavorites,
} = require('./blogs_for_test')

test('dummy returns one', () => {
  const result = listHelper.dummy([])
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(36)
  })
})

describe('favorite blog', () => {
  test('of empty list is undefined', () => {
    const result = listHelper.favoriteBlog([])
    expect(result).toBe(undefined)
  })

  test('when list has only one blog equals that', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    expect(result).toEqual({
      id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
    })
  })

  test('when list has many top favorites equals first match', () => {
    const result = listHelper.favoriteBlog(listWithManyTopFavorites)
    expect(result).toEqual({
      title: 'The Pacific Northwest Tree Octopus',
      author: 'Lyle Zapato',
      url: 'https://zapatopi.net/treeoctopus/',
      likes: 139,
      id: '64b42f095fadbb3e56011dd3',
    })
  })
})

describe('most blogs', () => {
  test('returns the author with the most number of blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3,
    })
  })

  test('when there are many top bloggers is the first match', () => {
    const result = listHelper.mostBlogs(listWithManyTopFavorites)
    expect(result).toEqual({
      author: 'Robert Smith',
      blogs: 1,
    })
  })
})

describe('most likes', () => {
  test('returns the author with the highest total number of likes', () => {
    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17,
    })
  })

  test('when there are many top bloggers is the first match', () => {
    const result = listHelper.mostLikes(listWithManyTopFavorites)
    expect(result).toEqual({
      author: 'Lyle Zapato',
      likes: 139,
    })
  })
})
