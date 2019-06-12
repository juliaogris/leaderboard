import React, { Fragment } from "react"

// todo(juliaogrs): Use URL (pattern) provided in backend result for query generation.
const getPrQuery = (title, createdAfter) => {
  if (title === "Merged Pull Requests") {
    return `is:pr is:merged created:>${createdAfter}`
  }
  if (title === "Merged or Open Pull Requests") {
    return `is:pr is:merged,open created:>${createdAfter}`
  }
  return `is:pr created:>${createdAfter}`
}

const getAuthorQuery = (title, author) => {
  if (!author) {
    return ""
  }
  if (
    title === "Merged Pull Requests" ||
    title === "Merged or Open Pull Requests"
  ) {
    return ` author:${author}`
  }
  return ` reviewed-by:${author}`
}
const buildQuery = (title, createdAfter, author) => {
  const prQuery = getPrQuery(title, createdAfter)
  const authorQuery = getAuthorQuery(title, author)
  const query = prQuery + authorQuery
  return `q=${encodeURIComponent(query)}`
}

const buildUrl = (title, config, author) => {
  const createdAfter = config.createdAfter.substring(0, 10)
  const query = buildQuery(title, createdAfter, author)
  return `${config.repository.url}/pulls?${query}`
}

const H2 = ({ children }) => (
  <h2 className="f4 f3-ns fw6 pt4 pb2-ns">{children}</h2>
)

const Link = ({ url, children }) => {
  const className = "link black-80 hover-blue underline-hover"
  const rel = "noopener noreferrer"
  const target = "_blank"
  return (
    <a href={url} target={target} rel={rel} className={className}>
      {children}
    </a>
  )
}

const Table = ({ children }) => (
  <table className="dt--fixed collapse f7 f6-ns">
    <tbody>{children}</tbody>
  </table>
)

const Tr = ({ point, authors, maxCount, countUrl }) => {
  const author = point.author
  const a = authors[author]
  const aUrl = a ? a.url : ""
  const avatarUrl = a ? a.avatarUrl : "missing-avatar-url"
  const alt = `avatar`
  const width = `${(point.count / maxCount) * 100}%`
  return (
    <tr className="w-100">
      <td className="w2 pr1 pt1">
        <Link url={aUrl}>
          <img className="h1 w1" src={avatarUrl} alt={alt} />
        </Link>
      </td>
      <td className="w4 pt1 truncate">
        <Link url={aUrl}>{author}</Link>
      </td>
      <td className="w2 pt1">
        <Link url={countUrl}>{point.count}</Link>
      </td>
      <td className="w-100">
        <Link url={countUrl}>
          <div className="bg-blue dim" style={{ width, height: "1rem" }}>
            &nbsp;
          </div>
        </Link>
      </td>
    </tr>
  )
}

const Heading = ({ title, config }) => {
  if (title === "Code Reviews" || title === "Code Review Comments") {
    return <H2>{title}</H2>
  }
  return (
    <H2>
      <Link url={buildUrl(title, config)}>{title}</Link>
    </H2>
  )
}

const Chart = ({ chart, authors, config }) => (
  <Fragment>
    <Heading title={chart.title} config={config} />
    <Table>
      {chart.points.map((point, i) => {
        const { title, maxCount } = chart
        const countUrl = buildUrl(title, config, point.author)
        const props = { point, authors, maxCount, countUrl }
        return <Tr {...props} key={i} />
      })}
    </Table>
  </Fragment>
)

export { Chart, Heading, getPrQuery, getAuthorQuery }
