import React from 'react'

import { createStyle } from './styles'

function LabelField(props) {
  const classes = createStyle()
  return (<div className={classes.container}>
    <div className={classes.root}>
      <div className={classes.input}><span className={`${classes.innerText} ${classes.font}`}>{props.value}</span></div>
      <label className={`${classes.label} ${classes.font}`}>{props.label}</label>
    </div>
  </div>)
}

export default LabelField