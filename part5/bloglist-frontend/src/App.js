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

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  const handleChange = (state) => (e) => {
    if (state === 'username') {
      setUsername(e.target.value)
    }

    if (state === 'password') {
      setPassword(e.target.value)
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
