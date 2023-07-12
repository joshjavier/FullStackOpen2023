import { useState, useEffect } from 'react'
import phonebookService from './services/phonebook'

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

const Person = ({ id, name, number, deletePerson }) => {
  return (
    <li data-id={id}>
      {name}
      {number && `: ${number}`}
      <button onClick={deletePerson}>delete</button>
    </li>
  )
}

const Persons = ({ persons, deletePerson }) => {
  return (
    <ul>
      {persons.map(({ id, name, number }) => (
        <Person
          key={id}
          id={id}
          name={name}
          number={number}
          deletePerson={deletePerson}
        />
      ))}
    </ul>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [query, setQuery] = useState('')

  const addPerson = (e) => {
    e.preventDefault()

    // Allow users to update the number of existing contacts in the phonebook
    const existingPerson = persons.find(
      ({ name }) => name.trim() === newName.trim()
    )
    if (existingPerson) {
      updatePerson(existingPerson, newNumber)
      return
    }

    const newPerson = {
      name: newName,
      number: newNumber,
      id: persons.length + 1,
    }

    // save new contact to the backend server
    phonebookService.create(newPerson).then((returnedPerson) => {
      // update state
      setPersons(persons.concat(newPerson))
      // clear input fields to prepare for new input
      setNewName('')
      setNewNumber('')
    })
  }

  const deletePerson = (e) => {
    const id = parseInt(e.target.parentElement.dataset.id)
    const contact = persons.find((person) => person.id === id)

    if (window.confirm(`Delete ${contact.name}?`)) {
      // delete contact from the backend server
      phonebookService.remove(id).then(() => {
        // update state
        const updatedPersons = persons.filter((person) => person.id !== id)
        setPersons(updatedPersons)
      })
    }
  }

  const updatePerson = (person, number) => {
    const confirmed = window.confirm(
      `${newName} is already added to phonebook, replace the old number with a new one?`
    )

    if (confirmed) {
      const updatedPerson = { ...person, number }
      phonebookService
        .update(person.id, updatedPerson)
        .then((returnedPerson) => {
          const updatedPersons = persons.map((person) =>
            person.id === returnedPerson.id ? returnedPerson : person
          )
          setPersons(updatedPersons)
        })
    }
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

  useEffect(() => {
    phonebookService
      .getAll()
      .then((initialPersons) => setPersons(initialPersons))
  }, [])

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
      <Persons persons={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App
