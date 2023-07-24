import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  const mockAdder = jest.fn()

  const renderComponent = () => render(<BlogForm addBlog={mockAdder} />)

  test('calls the event handler with the right details on submit', async () => {
    const user = userEvent.setup()

    renderComponent()

    const titleInput = screen.getByLabelText('title:')
    const authorInput = screen.getByLabelText('author:')
    const urlInput = screen.getByLabelText('url:')
    const sendButton = screen.getByText('create')

    await user.type(titleInput, 'test title')
    await user.type(authorInput, 'test author')
    await user.type(urlInput, 'test url')
    await user.click(sendButton)

    expect(mockAdder.mock.calls).toHaveLength(1)
    expect(mockAdder.mock.calls[0][0].title).toBe('test title')
    expect(mockAdder.mock.calls[0][0].author).toBe('test author')
    expect(mockAdder.mock.calls[0][0].url).toBe('test url')
  })
})
