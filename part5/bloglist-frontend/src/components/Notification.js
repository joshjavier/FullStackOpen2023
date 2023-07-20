const Notification = ({ message, type }) => {
  return (
    <div
      id="notification"
      className="notification"
      data-type={type}
      role="alert"
    >
      {message}
    </div>
  )
}

export default Notification
