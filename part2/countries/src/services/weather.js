import axios from 'axios'

const baseUrl = 'http://api.openweathermap.org/data/2.5/weather'
const apiKey = process.env.REACT_APP_API_KEY

const get = (location, units = 'metric') => {
  const url = `${baseUrl}?q=${location}&units=${units}&appid=${apiKey}`
  const request = axios.get(encodeURI(url))
  return request.then(
    (response) => response.data,
    (response) => console.error(response.message)
  )
}

// eslint-disable-next-line
export default { get }
