import React from "react"
import ReactDOM from "react-dom"
import App from "./screen/App"
import * as serviceWorker from "./serviceWorker"

// TODO(juliaogris): retrieve url from somewhere reasonable else ;)
ReactDOM.render(
  <App url="api/chart/go-course-ca39e2f201323a18" />,
  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
