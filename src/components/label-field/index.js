import React from 'react'

import { createStyle } from './styles'

function LabelField(props) {
  const classes = createStyle()
  return (<div className={classes.container}>
    <div className={classes.root}>
      <input className={classes.input} value={props.value} readOnly />
      <label className={classes.label}>{props.label}</label>
    </div>
  </div>)
}

export default LabelField