import React from 'react'

import { createStyle } from './styles'

function LabelField(props) {
  const classes = createStyle()
  return (<div className={classes.container}>
    <div className={classes.root}>
      <input className={`${classes.input} ${classes.font}`} value={props.value} readOnly />
      <label className={`${classes.label} ${classes.font}`}>{props.label}</label>
    </div>
  </div>)
}

export default LabelField