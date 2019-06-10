import React from "react"
import App from "./App"
import Adapter from "enzyme-adapter-react-16"
import { shallow, configure } from "enzyme"

configure({ adapter: new Adapter() })

test("chartData update for good fetch", async () => {
  const promise = new Promise((resolve, reject) => {
    resolve({ ok: true, status: 200, json: () => responseObjFixture })
  })
  global.fetch = jest.fn().mockImplementationOnce(() => promise)
  console.error = jest.fn()
  const app = shallow(<App url="http://example.com" />)
  expect(app.state("loading")).toBeTruthy()
  await promise
  setImmediate(() => {
    expect(app.state("loading")).toBeFalsy()
    expect(app.state("error")).toBeFalsy()
    expect(app.state("chartData")).toEqual(responseObjFixture)
    expect(console.error).toBeCalled()
    console.error.mockRestore()
  })
})

test("error update for error fetch", async () => {
  const promise = new Promise((resolve, reject) => {
    resolve({ ok: false, status: 500, json: () => null })
  })
  global.fetch = jest.fn().mockImplementationOnce(() => promise)
  const app = shallow(<App url="http://example.com" />)
  expect(app.state("loading")).toBeTruthy()
  await promise
  setImmediate(() => {
    expect(app.state("loading")).toBeFalsy()
    expect(app.state("error")).toBeTruthy()
  })
})

const responseObjFixture = {
  repository: {
    name: "my-repo",
    owner: "my-owner",
    url: "https://github.com/my-owner/my-repo"
  },
  charts: [
    {
      title: "My Chart",
      maxCount: 3,
      totalCount: 6,
      points: [
        { author: "a", count: "1" },
        { author: "b", count: "2" },
        { author: "C", count: "3" }
      ]
    }
  ],
  authors: {
    a: {
      login: "a",
      url: "https://github.com/a",
      avatarURL: "https://avatars3.githubusercontent.com/u/22388715?v=4"
    },
    b: {
      login: "b",
      url: "https://github.com/b",
      avatarURL: "https://avatars0.githubusercontent.com/u/6849798?v=4"
    },
    c: {
      login: "c",
      url: "https://github.com/c",
      avatarURL: "https://avatars2.githubusercontent.com/u/32605850?v=4"
    }
  }
}
