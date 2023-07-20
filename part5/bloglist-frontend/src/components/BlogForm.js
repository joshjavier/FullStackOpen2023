import { useState } from 'react'

const BlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    addBlog({ title, author, url })

    // clear form fields
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>add a new blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="blog-title">title:</label>
          <input
            type="text"
            id="blog-title"
            name="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <label htmlFor="blog-author">author:</label>
          <input
            type="text"
            id="blog-author"
            name="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <label htmlFor="blog-url">url:</label>
          <input
            type="text"
            id="blog-url"
            name="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button>create</button>
      </form>
    </div>
  )
}

export default BlogForm
