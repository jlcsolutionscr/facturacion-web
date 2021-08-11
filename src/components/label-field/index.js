import React from 'react'

import { createStyle } from './styles'

function LabelField(props) {
  const classes = createStyle()
  return (<div className={classes.container}>
    <div className={classes.root}>
      <input id="elem" className={classes.input} value={props.value} />
      <label htmlFor="elem" className={classes.label}>{props.label}</label>
    </div>
  </div>)
}

export default LabelField