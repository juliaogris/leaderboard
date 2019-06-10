import React, { Fragment } from "react"

const Chart = ({ chart, authors }) => (
  <Fragment>
    <h2>{chart.title}</h2>
    <table>
      <tbody>
        {chart.points.map((point, i) => {
          const a = authors[point.author]
          const aUrl = a ? a.url : ""
          return (
            <tr key={i}>
              <td>
                <a href={aUrl} target="_blank" rel="noopener noreferrer">
                  {point.author}
                </a>
              </td>
              <td>{point.count}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  </Fragment>
)

export default Chart
