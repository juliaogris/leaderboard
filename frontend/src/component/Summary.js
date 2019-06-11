import React, { Fragment } from "react"

const Summary = ({ charts }) => {
  if (!charts || charts.length === 0) {
    return null
  }
  const chartsByTitle = charts.reduce((obj, chart) => {
    obj[chart.title] = chart
    return obj
  }, {})
  // TODO(juliaogris): find a more generic way of expressing the following
  // summary, maybe as part of the backend service.
  const prChart = chartsByTitle["Merged Pull Requests"] || null
  const openChart = chartsByTitle["Merged or Open Pull Requests"] || null
  const reviewChart = chartsByTitle["Code Reviews"] || null
  const commentChart = chartsByTitle["Code Review Comments"] || null
  return (
    <Fragment>
      <PrSummary prChart={prChart} openChart={openChart} />
      <ReviewSummary reviewChart={reviewChart} commentChart={commentChart} />
    </Fragment>
  )
}

const P = ({ children }) => <p className="lh-copy measure">{children}</p>

const PrSummary = ({ prChart, openChart }) =>
  prChart &&
  openChart && (
    <P>
      <b>
        {prChart.points.length} people merged {prChart.totalCount} Pull Requests
      </b>
      , with a highest individual contribution of {prChart.maxCount}. There are
      an additional <b>{openChart.totalCount - prChart.totalCount} open PRs</b>{" "}
      in the works. The highest individual contribution of open and merged PRs
      is {openChart.maxCount}.
    </P>
  )

const ReviewSummary = ({ reviewChart, commentChart }) =>
  reviewChart &&
  commentChart && (
    <P>
      <b>{reviewChart.points.length} authors</b> created
      <b>{` ${reviewChart.totalCount} ${reviewChart.title}`}</b> and
      <b>{` ${commentChart.totalCount} ${commentChart.title}`}</b>.
    </P>
  )

export default Summary
