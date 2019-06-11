import React from "react"
import { Heading } from "./Heading"
import renderer from "react-test-renderer"

test("matches snapshot", () => {
  const repository = {
    name: "my-repo",
    owner: "my-owner",
    url: "https://github.com/my-owner/my-repo"
  }
  const tree = renderer.create(<Heading repository={repository} />).toJSON()
  expect(tree).toMatchSnapshot()
})
