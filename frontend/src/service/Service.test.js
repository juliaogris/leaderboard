import requestJson from "./Service"

const mockResponse = (ok, status, responseObj) => {
  global.fetch = jest.fn().mockImplementationOnce(() => {
    return new Promise((resolve, reject) => {
      resolve({ ok, status, json: () => responseObj })
    })
  })
  return global.fetch
}

test("fetches data with mocked fetch", async () => {
  const url = "http://exmple.com"
  const responseObj = { answer: "yes" }
  const mock = mockResponse(true, 200, responseObj)
  const resp = await requestJson(url)
  expect(resp).toEqual(responseObj)
  expect(mock).toBeCalled()
  expect(mock).lastCalledWith(url)
})

test("throws exception for not ok response", async () => {
  const url = "http://exmple.com"
  mockResponse(false, 500, null)
  console.error = jest.fn()
  let error = null
  await requestJson(url).catch(err => {
    error = err
  })
  expect(error).not.toBeNull()
  expect(console.error).toBeCalled()
  console.error.mockRestore()
})
