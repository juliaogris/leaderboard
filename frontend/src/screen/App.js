import React, { Component } from "react"
import { H1, Heading } from "../component/Heading"
import Summary from "../component/Summary"
import { Chart } from "../component/Chart"
import requestJson from "../service/Service"

const AppContainer = ({ children }) => (
  <div className="center avenir black-80 mw100 mw7-ns pa3 ph5-ns">
    {children}
  </div>
)

const Loading = () => (
  <AppContainer>
    <H1>Loading</H1>
  </AppContainer>
)

const Err = ({ error }) => {
  console.error(`error in App.js: ${error}`)
  return (
    <AppContainer>
      <H1>Something went wrong</H1>
    </AppContainer>
  )
}

const Footer = () => (
  <div className="bt b--black-20 pv3 mt5 f7 measure">
    Made with{" "}
    <span role="img" aria-label="heart">
      ❤️
    </span>{" "}
    by{" "}
    <a
      href="https://github.com/juliaogris/leaderboard/graphs/contributors"
      className="link black-80 underline-hover hover-blue"
      rel="noopener noreferrer"
      target="_blank"
    >
      Open Source Contributors
    </a>
  </div>
)
class App extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = { chartData: null, loading: true, error: null }
  }

  async componentDidMount() {
    let error = null
    const chartData = await requestJson(this.props.url).catch(err => {
      error = err
      return null
    })
    this.setState({ chartData, error, loading: false })
  }

  render() {
    const { loading, error, chartData } = this.state
    if (error) {
      return <Err error={error} />
    }
    if (loading) {
      return <Loading />
    }
    const { charts, config, authors, botComments } = chartData
    const repository = config.repository
    const bot = authors[config.botName] || {}
    bot.comments = botComments
    return (
      <AppContainer>
        <Heading repository={repository} />
        <Summary charts={charts} config={config} bot={bot} />
        {charts.map((chart, i) => {
          const props = { chart, authors, config }
          return <Chart key={i} {...props} />
        })}
        <Footer />
      </AppContainer>
    )
  }
}

export { App, AppContainer, Loading, Footer, Err }
