import React from 'react'

import { createStyle } from './styles'

function LabelField(props) {
  const classes = createStyle()
  return (<div className={classes.container}>
    <div className={classes.root}>
      <label className={`${classes.input} ${classes.font}`}>{props.value}</label>
      <label className={`${classes.label} ${classes.font}`}>{props.label}</label>
    </div>
  </div>)
}

export default LabelField