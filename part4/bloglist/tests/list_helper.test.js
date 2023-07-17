const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
    },
  ]

  const biggerList = [
    {
      title: 'A tutorial quantum interpreter in 150 lines of Lisp',
      author: 'Robert Smith',
      url: 'https://www.stylewarning.com/posts/quantum-interpreter/',
      likes: 43,
      id: '64b42caa5fadbb3e56011dd1',
    },
    {
      title: 'The Pacific Northwest Tree Octopus',
      author: 'Lyle Zapato',
      url: 'https://zapatopi.net/treeoctopus/',
      likes: 139,
      id: '64b42f095fadbb3e56011dd3',
    },
    {
      title: 'Forth: The programming language that writes itself: The Web Page',
      author: 'Dave Gauer',
      url: 'http://ratfactor.com/forth/the_programming_language_that_writes_itself.html',
      likes: 82,
      id: '64b42f7a5fadbb3e56011dd5',
    },
    {
      title: 'Unauthenticated RCE on a RIGOL oscilloscope',
      author: 'Manuel Romei',
      url: 'https://tortel.li/post/insecure-scope/',
      likes: 25,
      id: '64b43941042b5b8e0c468b65',
    },
  ]

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(biggerList)
    expect(result).toBe(289)
  })
})