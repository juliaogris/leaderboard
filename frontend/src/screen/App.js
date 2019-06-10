import React, { Component, Fragment } from "react"
import Heading from "../component/Heading"
import Summary from "../component/Summary"
import Chart from "../component/Chart"
import requestJson from "../service/Service"

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
      console.error(`error in App.js: ${error}`)
      return <h1>Something went wrong</h1>
    }
    if (loading) {
      return <h1>Loading</h1>
    }
    const { charts, repository, authors } = chartData
    return (
      <Fragment>
        <Heading repository={repository} />
        <Summary charts={charts} />
        {charts.map((chart, i) => (
          <Chart key={i} chart={chart} authors={authors} />
        ))}
      </Fragment>
    )
  }
}

export default App
