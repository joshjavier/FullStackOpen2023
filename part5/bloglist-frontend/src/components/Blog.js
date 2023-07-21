import { useState } from 'react'

const Blog = ({ blog, incrementLikes }) => {
  const { title, author, url, likes, user } = blog
  const [hidden, setHidden] = useState(true)

  const toggle = () => {
    setHidden(!hidden)
  }

  return (
    <div className="blog-item">
      <div>
        <span>
          {title}
          {author && ` by ${author}`}
        </span>{' '}
        <button onClick={toggle}>{hidden ? 'view' : 'hide'}</button>
      </div>
      <div hidden={hidden} className="details">
        <p>
          <a href={url}>🔗 {url}</a>
        </p>
        <p>
          <span>❤️ likes: {likes}</span>{' '}
          <button onClick={incrementLikes(blog)}>like</button>
        </p>
        {user && <p>👤 {user?.name || user.username}</p>}
      </div>
    </div>
  )
}

export default Blog
