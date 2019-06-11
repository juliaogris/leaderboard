import React from "react"
import Chart from "./Chart"
import renderer from "react-test-renderer"

test("matches snapshot charts with unknown title", () => {
  const chart = {
    title: "My Chart",
    maxCount: 3,
    totalCount: 6,
    points: [
      { author: "a", count: "1" },
      { author: "b", count: "2" },
      { author: "c", count: "3" }
    ]
  }
  const authors = {
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

  const tree = renderer
    .create(<Chart chart={chart} authors={authors} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
