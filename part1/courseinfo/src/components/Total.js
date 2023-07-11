const Total = (props) => {
  const total = props.parts
    .map((part) => part.exercises)
    .reduce((acc, val) => acc + val)

  return <p>Number of exercises {total}</p>
}

export default Total
