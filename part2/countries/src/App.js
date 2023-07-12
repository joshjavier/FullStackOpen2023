import { useState, useEffect } from 'react'

import countriesService from './services/countries'

const SearchBox = ({ query, handleChange }) => {
  return (
    <div>
      <label htmlFor="country">find countries</label>
      <input
        id="country"
        type="search"
        value={query}
        onChange={handleChange}
        placeholder="philippines"
      />
    </div>
  )
}

const SearchResults = ({ countries, showCountry }) => {
  return (
    <ul>
      {countries.map((country) => (
        <li key={country}>
          {country}
          <button onClick={showCountry(country)}>show</button>
        </li>
      ))}
    </ul>
  )
}

const Country = ({ name, capital, area, languages, flagImg, flagAlt }) => {
  return (
    <div>
      <h2>{name}</h2>
      <p>capital {capital}</p>
      <p>area {area}</p>

      <h3>languages:</h3>
      <ul>
        {languages.map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>

      <img src={flagImg} alt={flagAlt} />
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState(null)
  const [query, setQuery] = useState('')

  const handleChange = (e) => {
    setQuery(e.target.value)
  }

  const showCountry = (countryName) => () => {
    setQuery(countryName)
  }

  const matchingCountries =
    query === ''
      ? countries
      : countries.filter(({ name }) =>
          name.common.toLowerCase().includes(query.toLowerCase())
        )

  let tooManyMatches, tenOrLessMatches, onlyOneMatch
  if (countries) {
    tooManyMatches = query !== '' && matchingCountries.length > 10
    tenOrLessMatches =
      matchingCountries.length <= 10 && matchingCountries.length > 1
    onlyOneMatch = matchingCountries.length === 1
  }

  useEffect(() => {
    countriesService.getAll().then((countries) => {
      setCountries(countries)
    })
  }, [])

  return (
    <div>
      <SearchBox query={query} handleChange={handleChange} />

      {tooManyMatches ? (
        <div>Too many matches, specify another filter</div>
      ) : tenOrLessMatches ? (
        <SearchResults
          countries={matchingCountries.map(({ name }) => name.common)}
          showCountry={showCountry}
        />
      ) : onlyOneMatch ? (
        <Country
          name={matchingCountries[0].name.common}
          capital={matchingCountries[0].capital[0]}
          area={matchingCountries[0].area}
          languages={Object.values(matchingCountries[0].languages)}
          flagImg={matchingCountries[0].flags.png}
          flagAlt={matchingCountries[0].flags.alt}
        />
      ) : null}
    </div>
  )
}

export default App
