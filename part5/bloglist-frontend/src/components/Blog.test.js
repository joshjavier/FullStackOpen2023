import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'When Things Go Missing',
    author: 'Kathryn Schulz',
    url: 'https://www.newyorker.com/magazine/2017/02/13/when-things-go-missing',
    likes: 0,
  }
  const username = 'deku'
  const mockLiker = jest.fn()
  const mockDeleter = jest.fn()

  const renderComponent = () =>
    render(
      <Blog
        blog={blog}
        username={username}
        incrementLikes={mockLiker}
        deleteBlog={mockDeleter}
      />
    )

  test('renders title and author but initially hides URL, likes, etc.', () => {
    renderComponent()

    const titleAuthor = screen.getByText(
      'When Things Go Missing by Kathryn Schulz'
    )
    const url = screen.getByText('http', { exact: false })
    const likes = screen.getByText('likes', { exact: false })

    expect(titleAuthor).toBeVisible()
    expect(url).not.toBeVisible()
    expect(likes).not.toBeVisible()
  })
})
