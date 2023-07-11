const Header = ({ name }) => <h1>{name}</h1>

const Total = ({ sum }) => (
  <p>
    <strong>Number of exercises {sum}</strong>
  </p>
)

const Part = ({ name, exercises }) => (
  <p>
    {name} {exercises}
  </p>
)

const Content = ({ parts }) => (
  <>
    {parts.map(({ id, name, exercises }) => (
      <Part key={id} name={name} exercises={exercises} />
    ))}
  </>
)

const Course = ({ name, parts }) => {
  const sum = parts.reduce((acc, val) => acc + val.exercises, 0)

  return (
    <div>
      <Header name={name} />
      <Content parts={parts} />
      <Total sum={sum} />
    </div>
  )
}

export default Course
