import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [alert, setAlert] = useState(null)

  const login = (credentials) => {
    const { username, password } = credentials

    loginService
      .login({ username, password })
      .then((user) => {
        // save the returned object to state
        setUser(user)
        // use the token for authorizing blog requests
        blogService.setToken(user.token)
        // save the returned object to local storage
        window.localStorage.setItem('loggedUser', JSON.stringify(user))
        // notify the user
        showAlert('You are now logged in!')
      })
      .catch((error) => {
        showAlert(error.response.data.error, 'error')
      })
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
    showAlert('You have been logged out. Thanks for using this app!')
  }

  const addBlog = (blog) => {
    const { title, author, url } = blog

    blogService
      .create({ title, author, url })
      .then((newBlog) => {
        const updatedBlogs = blogs.concat(newBlog)
        setBlogs(updatedBlogs)

        showAlert(
          `added a new blog: ${newBlog.title}${
            newBlog.author ? ' by ' + newBlog.author : ''
          }`
        )
      })
      .catch((error) => {
        showAlert(error.response.data.error, 'error')
      })
  }

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type })
    setTimeout(() => setAlert(null), 5000)
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

      <Notification message={alert?.message} type={alert?.type} />

      {!user ? (
        <LoginForm login={login} />
      ) : (
        <>
          <p>
            Konnichiwa, {user.name}!{' '}
            <button onClick={handleLogout}>log out</button>
          </p>

          <BlogForm addBlog={addBlog} />

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