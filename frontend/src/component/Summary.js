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
      <ChartSummary chart={prChart} />
      <ChartSummary chart={openChart} />
      <ReviewSummary reviewChart={reviewChart} commentChart={commentChart} />
    </Fragment>
  )
}

const ChartSummary = ({ chart }) =>
  chart && (
    <p>
      <b>{chart.points.length} authors</b> created
      <b>{` ${chart.totalCount} ${chart.title}`}</b>, with a highest individual
      contribution of {chart.maxCount}.
    </p>
  )

const ReviewSummary = ({ reviewChart, commentChart }) =>
  reviewChart &&
  commentChart && (
    <p>
      <b>{reviewChart.points.length} authors</b> created
      <b>{` ${reviewChart.totalCount} ${reviewChart.title}`}</b> and
      <b>{` ${commentChart.totalCount} ${commentChart.title}`}</b>
    </p>
  )

export default Summary
