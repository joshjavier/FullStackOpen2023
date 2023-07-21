import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const Toggleable = forwardRef(({ children, buttonLabel }, ref) => {
  const [hidden, setHidden] = useState(true)

  const showComponent = () => {
    setHidden(false)
  }

  const hideComponent = () => {
    setHidden(true)
  }

  useImperativeHandle(ref, () => {
    return { hideComponent }
  })

  return (
    <div>
      <button hidden={!hidden} onClick={showComponent}>
        {buttonLabel}
      </button>
      <div hidden={hidden}>
        {children}
        <button onClick={hideComponent}>cancel</button>
      </div>
    </div>
  )
})

Toggleable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
}

export default Toggleable
