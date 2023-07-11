import { useState } from 'react'

const Filter = ({ query, handleChange }) => {
  return (
    <label>
      filter shown with{' '}
      <input type="text" value={query} onChange={handleChange} name="search" />
    </label>
  )
}

const PersonForm = ({ newName, newNumber, handleChange, addPerson }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        <label>
          name:{' '}
          <input
            type="text"
            value={newName}
            onChange={handleChange}
            name="name"
          />
        </label>
      </div>
      <div>
        <label>
          number:{' '}
          <input
            type="text"
            value={newNumber}
            onChange={handleChange}
            name="number"
          />
        </label>
      </div>
      <button>add</button>
    </form>
  )
}

const Persons = ({ persons }) => {
  return (
    <ul>
      {persons.map(({ id, name, number }) => (
        <li key={id}>
          {name}
          {number && `: ${number}`}
        </li>
      ))}
    </ul>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 },
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [query, setQuery] = useState('')

  const addPerson = (e) => {
    e.preventDefault()

    // Prevent the user from adding existing names in the phonebook
    if (persons.some(({ name }) => name.trim() === newName.trim())) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    setPersons((p) =>
      p.concat({
        name: newName,
        number: newNumber,
        id: p.length + 1,
      })
    )
    setNewName('')
    setNewNumber('')
  }

  const handleChange = (e) => {
    if (e.target.name === 'name') {
      setNewName(e.target.value)
    }

    if (e.target.name === 'number') {
      setNewNumber(e.target.value)
    }

    if (e.target.name === 'search') {
      setQuery(e.target.value)
    }
  }

  const personsToShow =
    query === ''
      ? persons
      : persons.filter(({ name }) =>
          name.toLowerCase().includes(query.toLowerCase())
        )

  return (
    <div>
      <h1>Phonebook</h1>
      <Filter query={query} handleChange={handleChange} />

      <h2>add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleChange={handleChange}
        addPerson={addPerson}
      />

      <h2>Numbers</h2>
      <Persons persons={personsToShow} />
    </div>
  )
}

export default App
