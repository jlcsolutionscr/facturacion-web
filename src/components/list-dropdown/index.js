import React from 'react'

import { createStyle } from './styles'

function ListDropdown(props) {
  const classes = createStyle()
  const [open, setOpen] = React.useState(false)
  return (<div className={classes.container} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}>
    <div className={classes.root}>
      <input className={`${classes.input} ${classes.font}`} value={props.value} readOnly onChange={props.onChange}/>
      <label className={`${classes.label} ${classes.font}`}>{props.label}</label>
    </div>
    <div style={{display: open ? 'block' : 'none'}}>
      <label className={`${classes.input} ${classes.font}`}>Listado de productos</label>
    </div>
  </div>)
}

export default ListDropdown
