import React, { Fragment } from "react"

const Summary = ({ charts, config, bot }) => {
  if (!charts || charts.length === 0) {
    return null
  }
  const chartsByTitle = charts.reduce((obj, chart) => {
    obj[chart.title] = chart
    return obj
  }, {})
  // TODO(#7): Make charts generic
  const pr = chartsByTitle["Merged Pull Requests"] || null
  const open = chartsByTitle["Merged or Open Pull Requests"] || null
  const review = chartsByTitle["Code Reviews"] || null
  const comment = chartsByTitle["Code Review Comments"] || null
  return (
    <Fragment>
      <PrSummary pr={pr} open={open} config={config} />
      <ReviewSummary {...{ review, comment, bot }} />
      <Note config={config} />
    </Fragment>
  )
}

const P = ({ children }) => <p className="lh-copy measure">{children}</p>
const Code = ({ children }) => (
  <code className="f7 fs-normal ba b--black-20 br1 ph1">{children}</code>
)

const PrSummary = ({ pr, open, config }) => {
  if (!pr || !open) {
    return null
  }
  const repoUrl = config.repository.url
  const path = "/pulls"
  const createdAfter = config.createdAfter.substring(0, 10)
  const queryOpen = "?q=is%3Apr+is%3Aopen+created%3A>" + createdAfter
  const queryMerged = "?q=is%3Apr+is%3Amerged+created%3A>" + createdAfter
  const openUrl = `${repoUrl}${path}${queryOpen}`
  const mergedUrl = `${repoUrl}${path}${queryMerged}`
  return (
    <P>
      <b>
        {pr.points.length} people{" "}
        <Link url={mergedUrl}>merged {pr.totalCount} Pull Requests</Link>
      </b>
      , with a highest individual contribution of {pr.maxCount}. There are an
      additional{" "}
      <Link url={openUrl}>{open.totalCount - pr.totalCount} open PRs</Link> in
      the works. The highest individual contribution of open and merged PRs is{" "}
      {open.maxCount}.
    </P>
  )
}

const ReviewSummary = ({ review, comment, bot }) =>
  review &&
  comment && (
    <P>
      <b>{review.points.length} authors</b> created
      <b>{` ${review.totalCount} ${review.title}`}</b> and
      <b>{` ${comment.totalCount} ${comment.title}`}</b>.{" "}
      <Link url={bot.url} ttc>
        <img src={bot.avatarUrl} alt="avatar" className="h1 w1 ph1" />
        {bot.login}
      </Link>{" "}
      made {bot.comments} comments.
    </P>
  )

const Note = ({ config }) => (
  <p className="lh-copy measure-wide f6 i">
    PRs have been filtered by labels matching <Code>{config.labelGlob}</Code>{" "}
    and creation date after <Code>{config.createdAfter.substring(0, 10)}</Code>
  </p>
)

const Link = ({ url, children, ttc }) => {
  const classNamePrefix = "link black-80 hover-blue underline-hover"
  const className = `${classNamePrefix} ${ttc ? "ttc nowrap" : "b"}`
  const rel = "noopener noreferrer"
  const target = "_blank"
  return (
    <a href={url} target={target} rel={rel} className={className}>
      {children}
    </a>
  )
}

export default Summary
