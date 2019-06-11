import React, { Fragment } from "react"

const H2 = ({ children }) => <h2 className="f4 f3-ns fw6 pt3">{children}</h2>

const Link = ({ url, children }) => (
  <a href={url} target="_blank" rel="noopener noreferrer" className="link">
    {children}
  </a>
)

const Table = ({ children }) => (
  <table className="dt--fixed collapse f7 f6-ns">
    <tbody>{children}</tbody>
  </table>
)

const Tr = ({ point, authors, maxCount }) => {
  const author = point.author
  const a = authors[author]
  const aUrl = a ? a.url : ""
  const avatarUrl = a ? a.avatarURL : "missing-avatar-url"
  const alt = `avatar`
  const width = `${(point.count / maxCount) * 100}%`
  return (
    <tr className="w-100">
      <td className="w2 pr1 pt1">
        <img className="h1 w1" src={avatarUrl} alt={alt} />
      </td>
      <td className="w4 pt1 truncate">
        <Link url={aUrl}>{author}</Link>
      </td>
      <td className="w2 pt1">{point.count}</td>
      <td className="w-100">
        <div className="bg-blue" style={{ width, height: "1rem" }}>
          &nbsp;
        </div>
      </td>
    </tr>
  )
}

const Chart = ({ chart, authors }) => (
  <Fragment>
    <H2>{chart.title}</H2>
    <Table>
      {chart.points.map((point, i) => (
        <Tr point={point} authors={authors} maxCount={chart.maxCount} key={i} />
      ))}
    </Table>
  </Fragment>
)

export default Chart
