const requestJson = async url => {
  const response = await fetch(url)
  if (!response.ok) {
    console.error(
      `cannot request ${url}. response: ${JSON.stringify(response)}`
    )
    throw new Error(`error fetching URL: ${url}`)
  }
  return await response.json()
}

export default requestJson
