import React, { Component, PropTypes } from 'react'
import { AppContainer } from 'react-hot-loader'

export default class App extends Component {
  static childContextTypes = {
    router: PropTypes.object,
    headManager: PropTypes.object
  }

  constructor (props) {
    super(props)
    this.state = propsToState(props)
    this.close = null
  }

  componentWillReceiveProps (nextProps) {
    const state = propsToState(nextProps)
    try {
      this.setState(state)
    } catch (err) {
      console.error(err)
    }
  }

  componentDidMount () {
    const { router } = this.props

    this.close = router.subscribe((data) => {
      const props = data.props || this.state.props
      const state = propsToState({
        ...data,
        props,
        router
      })

      try {
        this.setState(state)
      } catch (err) {
        console.error(err)
      }
    })
  }

  componentWillUnmount () {
    if (this.close) this.close()
  }

  getChildContext () {
    const { router, headManager } = this.props
    return { router, headManager }
  }

  render () {
    const { Component, props } = this.state

    return <AppContainer>
      <Component {...props} />
    </AppContainer>
  }
}

function propsToState (props) {
  const { Component, router } = props
  const { route } = router
  const url = {
    query: router.query,
    pathname: router.pathname,
    back: () => router.back(),
    push: (url) => router.push(route, url),
    pushTo: (href, as) => {
      const pushRoute = as ? href : null
      const pushUrl = as || href

      return router.push(pushRoute, pushUrl)
    },
    replace: (url) => router.replace(route, url),
    replaceTo: (href, as) => {
      const replaceRoute = as ? href : null
      const replaceUrl = as || href

      return router.replace(replaceRoute, replaceUrl)
    }
  }

  return {
    Component,
    props: { ...props.props, url }
  }
}
