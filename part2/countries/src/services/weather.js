import axios from 'axios'

const baseUrl = 'http://api.openweathermap.org/data/2.5/weather'
const apiKey = process.env.REACT_APP_API_KEY

const get = (location, units = 'metric') => {
  const request = axios.get(
    `${baseUrl}?q=${location}&units=${units}&appid=${apiKey}`
  )
  return request.then((response) => response.data)
}

// eslint-disable-next-line
export default { get }
