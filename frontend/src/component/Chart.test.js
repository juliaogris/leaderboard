import React from "react"
import { Chart, Heading, getPrQuery, getAuthorQuery } from "./Chart"
import renderer from "react-test-renderer"

test("getPrQuery", () => {
  const prMergedQuery = getPrQuery("Merged or Open Pull Requests", "2019-01-01")
  expect(prMergedQuery).toBe("is:pr is:merged,open created:>2019-01-01")
  const prOpenQuery = getPrQuery("Merged Pull Requests", "2019-01-01")
  expect(prOpenQuery).toBe("is:pr is:merged created:>2019-01-01")
})

test("getAuthorQuery", () => {
  const authorQuery = getAuthorQuery(
    "Merged or Open Pull Requests",
    "my-author"
  )
  expect(authorQuery).toBe(" author:my-author")
})

test("matches Heading snapshot", () => {
  const tree = renderer.create(<Heading title="Code Reviews" />).toJSON()
  expect(tree).toMatchSnapshot()
})

test("matches Chart snapshot charts with unknown title", () => {
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
  const config = {
    labelGlob: "lab.*",
    botName: "golangcibot",
    createdAfter: "2019-05-15T00:00:00Z",
    repository: {
      name: "go-course",
      owner: "anz-bank",
      url: "https://github.com/anz-bank/go-course"
    }
  }

  const tree = renderer
    .create(<Chart chart={chart} authors={authors} config={config} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
