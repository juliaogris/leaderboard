// TODO(juliaogris): error handling for async request
const requestJson = async url => {
  const response = await fetch(url)
  if (!response.ok) {
    console.error(
      `cannot request ${url}. response: ${JSON.stringify(response)}`
    )
    throw new Error("Something went wrong")
  }
  return await response.json()
}

export default requestJson
