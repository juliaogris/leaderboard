import React from "react"

const H1 = ({ children }) => <h1 className="f2 fw6 pv1 pv3-ns">{children}</h1>
const Link = ({ url, children }) => (
  <a href={url} target="_blank" rel="noopener noreferrer" className="link ttc">
    {children}
  </a>
)

const Heading = ({ repository }) =>
  repository && (
    <H1>
      <Link url={repository.url}>{repository.name}</Link> Leaderboard
    </H1>
  )

export { H1, Heading, Link }
