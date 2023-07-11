import { useState } from 'react'

const Anecdote = ({ text, votes }) => {
  return (
    <>
      <p>{text}</p>
      <p>has {votes} votes</p>
    </>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.',
  ]

  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(anecdotes.map((_) => 0))

  const nextAnecdote = () => {
    let newIndex = selected
    while (newIndex === selected) {
      newIndex = Math.floor(Math.random() * anecdotes.length)
    }
    setSelected(newIndex)
  }

  const voteAnecdote = () => {
    setPoints((p) => p.map((x, i) => (i === selected ? x + 1 : x)))
  }

  const mostVoted = points.indexOf(Math.max(...points))

  return (
    <div>
      <h2>Anecdote of the day</h2>
      <Anecdote text={anecdotes[selected]} votes={points[selected]} />
      <button onClick={voteAnecdote}>vote</button>
      <button onClick={nextAnecdote}>next anecdote</button>

      {points.reduce((a, b) => a + b) >= 3 && (
        <div>
          <h2>Anecdote with most votes</h2>
          <Anecdote text={anecdotes[mostVoted]} votes={points[mostVoted]} />
        </div>
      )}
    </div>
  )
}

export default App
