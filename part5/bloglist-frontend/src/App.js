import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const LoginForm = ({ username, password, handleLogin, handleChange }) => {
  return (
    <form onSubmit={handleLogin}>
      <div>
        <label htmlFor="username">username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={handleChange('username')}
        />
      </div>
      <div>
        <label htmlFor="password">password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={handleChange('password')}
        />
      </div>
      <button>login</button>
    </form>
  )
}

const CreateBlogForm = ({
  title,
  author,
  url,
  handleChange,
  handleCreateBlog,
}) => {
  return (
    <div>
      <h2>create a new blog</h2>
      <form onSubmit={handleCreateBlog}>
        <div>
          <label htmlFor="blog-title">title:</label>
          <input
            type="text"
            id="blog-title"
            name="title"
            value={title}
            onChange={handleChange('title')}
          />
        </div>
        <div>
          <label htmlFor="blog-author">author:</label>
          <input
            type="text"
            id="blog-author"
            name="author"
            value={author}
            onChange={handleChange('author')}
          />
        </div>
        <div>
          <label htmlFor="blog-url">url:</label>
          <input
            type="text"
            id="blog-url"
            name="url"
            value={url}
            onChange={handleChange('url')}
          />
        </div>
        <button>create</button>
      </form>
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  const handleChange = (state) => (e) => {
    if (state === 'username') {
      setUsername(e.target.value)
    }

    if (state === 'password') {
      setPassword(e.target.value)
    }

    if (state === 'title') {
      setTitle(e.target.value)
    }

    if (state === 'author') {
      setAuthor(e.target.value)
    }

    if (state === 'url') {
      setUrl(e.target.value)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedUser', JSON.stringify(user))

      // clear the login form fields
      setUsername('')
      setPassword('')
    } catch (error) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const handleCreateBlog = async (e) => {
    e.preventDefault()

    try {
      const newBlog = await blogService.create({ title, author, url })
      const updatedBlogs = blogs.concat(newBlog)
      setBlogs(updatedBlogs)

      // clear form fields
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (error) {
      setErrorMessage(error.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  useEffect(() => {
    // check localstorage for loggedUser key
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }

    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  return (
    <div>
      <h1>blogs</h1>

      {!user ? (
        <LoginForm
          username={username}
          password={password}
          handleLogin={handleLogin}
          handleChange={handleChange}
        />
      ) : (
        <>
          <p>
            Konnichiwa, {user.name}! You are now logged in.{' '}
            <button onClick={handleLogout}>log out</button>
          </p>

          <CreateBlogForm
            title={title}
            author={author}
            url={url}
            handleChange={handleChange}
            handleCreateBlog={handleCreateBlog}
          />

          <ul>
            {blogs.map((blog) => (
              <li key={blog.id}>
                <Blog blog={blog} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default App
