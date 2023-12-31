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

  test('shows URL, likes, etc. when the view button is clicked', async () => {
    const user = userEvent.setup()

    renderComponent()

    const viewButton = screen.getByText('view')
    const url = screen.getByText('http', { exact: false })
    const likes = screen.getByText('likes', { exact: false })
    await user.click(viewButton)

    expect(url).toBeVisible()
    expect(likes).toBeVisible()
  })

  test('has a like button that can be clicked', async () => {
    const user = userEvent.setup()

    renderComponent()

    const viewButton = screen.getByText('view')
    const likeButton = screen.getByText('like')

    // show the like button first
    await user.click(viewButton)

    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockLiker.mock.calls).toHaveLength(2)
  })
})
