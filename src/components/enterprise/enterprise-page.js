import React from 'react'
import { connect } from 'react-redux'

import LoginPage from 'components/enterprise/login/login-page'
import HomePage from 'components/enterprise/home/home-page'

const style = {
  display: 'flex'
}

function EnterprisePage(props) {
  const component = !props.authenticated ? <LoginPage /> : <HomePage />
  return (
    <div style={style}>
      {component}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.session.authenticated
  }
}

export default connect(mapStateToProps, null)(EnterprisePage)
