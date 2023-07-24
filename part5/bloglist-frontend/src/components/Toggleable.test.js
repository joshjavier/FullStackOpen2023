import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Toggleable from './Toggleable'

describe('<Toggleable />', () => {
  const renderComponent = () =>
    render(
      <Toggleable buttonLabel="show...">
        <div>toggleable content</div>
      </Toggleable>
    )

  test('renders its children', async () => {
    renderComponent()
    await screen.findAllByText('toggleable content')
  })

  test('initially does not display its children', () => {
    renderComponent()
    const element = screen.getByText('toggleable content')
    expect(element).not.toBeVisible()
  })

  test('displays its children after clicking the show button', async () => {
    const user = userEvent.setup()

    renderComponent()

    const button = screen.getByText('show...')
    await user.click(button)

    const element = screen.getByText('toggleable content')
    expect(element).toBeVisible()
  })

  test('hides its children after clicking the close button', async () => {
    const user = userEvent.setup()

    renderComponent()

    const showButton = screen.getByText('show...')
    const closeButton = screen.getByText('cancel')

    await user.click(showButton)
    await user.click(closeButton)

    const element = screen.getByText('toggleable content')
    expect(element).not.toBeVisible()
  })
})
