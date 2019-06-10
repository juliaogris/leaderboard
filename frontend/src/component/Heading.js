import React from "react"

const Heading = ({ repository }) =>
  repository && (
    <h1>
      Leader board for{" "}
      <a href={repository.url} target="_blank" rel="noopener noreferrer">
        {repository.owner}/{repository.name}
      </a>
    </h1>
  )

export default Heading
