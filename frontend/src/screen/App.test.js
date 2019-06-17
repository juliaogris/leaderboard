import React from "react"
import renderer from "react-test-renderer"
import Adapter from "enzyme-adapter-react-16"
import { shallow, configure } from "enzyme"
import { App, AppContainer, Loading, Footer, Err } from "./App"

configure({ adapter: new Adapter() })

test("AppContainer matches snapshot", () => {
  const tree = renderer.create(<AppContainer />).toJSON()
  expect(tree).toMatchSnapshot()
})

test("Loading matches snapshot", () => {
  const tree = renderer.create(<Loading />).toJSON()
  expect(tree).toMatchSnapshot()
})

test("Footer matches snapshot", () => {
  const tree = renderer.create(<Footer />).toJSON()
  expect(tree).toMatchSnapshot()
})

test("Err matches snapshot", () => {
  console.error = jest.fn()
  const tree = renderer.create(<Err />).toJSON()
  expect(tree).toMatchSnapshot()
  expect(console.error).toBeCalled()
  console.error.mockRestore()
})

test("chartData update for good fetch", async () => {
  const promise = new Promise((resolve, reject) => {
    resolve({ ok: true, status: 200, json: () => responseObjFixture })
  })
  global.fetch = jest.fn().mockImplementationOnce(() => promise)
  console.error = jest.fn()
  const app = shallow(<App url="http://example.com" />)
  expect(app.state("loading")).toBeTruthy()
  await promise
  expect(console.error).not.toBeCalled()
  console.error.mockRestore()
  setImmediate(() => {
    expect(app.state("loading")).toBeFalsy()
    expect(app.state("error")).toBeFalsy()
    expect(app.state("chartData")).toEqual(responseObjFixture)
  })
})

test("error update for error fetch", async () => {
  const promise = new Promise((resolve, reject) => {
    resolve({ ok: false, status: 500, json: () => null })
  })
  global.fetch = jest.fn().mockImplementationOnce(() => promise)
  console.error = jest.fn()
  const app = shallow(<App url="http://example.com" />)
  expect(app.state("loading")).toBeTruthy()
  await promise
  expect(console.error).toBeCalled()
  console.error.mockRestore()
  setImmediate(() => {
    expect(app.state("loading")).toBeFalsy()
    expect(app.state("error")).toBeTruthy()
  })
})

const responseObjFixture = {
  config: {
    labelGlob: "lab.*",
    botName: "golangcibot",
    createdAfter: "2019-05-15T00:00:00Z",
    repository: {
      name: "go-course",
      owner: "anz-bank",
      url: "https://github.com/anz-bank/go-course"
    }
  },
  charts: [
    {
      title: "My Chart",
      maxCount: 3,
      totalCount: 6,
      points: [
        { author: "a", count: "1" },
        { author: "b", count: "2" },
        { author: "C", count: "3" } // non-existent author
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
    }
  }
}
