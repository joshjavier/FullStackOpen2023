const blogs = [
  {
    id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  },
]

const listWithOneBlog = [
  {
    id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
]

const listWithManyTopFavorites = [
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
  {
    title: 'How to register a Kei truck in Pennsylvania',
    author: 'Dan Wilkerson',
    url: 'https://danwilkerson.com/posts/2023-05-30-how-to-register-a-kei-truck-in-pa',
    likes: 139,
    id: '64b49c73d7dc551177b6a817',
  },
]

module.exports = { blogs, listWithOneBlog, listWithManyTopFavorites }
