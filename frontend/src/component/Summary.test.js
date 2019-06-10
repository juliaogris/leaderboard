import React from "react"
import Summary from "./Summary"
import renderer from "react-test-renderer"

test("matches snapshot for empty charts array", () => {
  const tree = renderer.create(<Summary charts={[]} />).toJSON()
  expect(tree).toMatchSnapshot()
})

test("matches snapshot charts", () => {
  const charts = [
    {
      title: "Merged Pull Requests",
      maxCount: 4,
      totalCount: 16,
      points: [1, 2, 3, 4, 5] // only length of points matters
    },
    {
      title: "Merged or Open Pull Requests",
      maxCount: 5,
      totalCount: 73,
      points: [1, 2, 3, 4, 5, 6, 7]
    },
    {
      title: "Code Reviews",
      maxCount: 47,
      totalCount: 382,
      points: [1, 2, 3]
    },
    {
      title: "Code Review Comments",
      maxCount: 121,
      totalCount: 852,
      points: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }
  ]
  const tree = renderer.create(<Summary charts={charts} />).toJSON()
  expect(tree).toMatchSnapshot()
})

test("matches snapshot charts with unknown title", () => {
  const charts = [
    {
      title: "UNKNOWN CHART TITLE",
      maxCount: 121,
      totalCount: 852,
      points: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }
  ]
  const tree = renderer.create(<Summary charts={charts} />).toJSON()
  expect(tree).toMatchSnapshot()
})
