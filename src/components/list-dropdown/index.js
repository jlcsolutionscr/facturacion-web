import React from 'react'
import UAParser from 'ua-parser-js'

import { createStyle } from './styles'

function ListDropdown(props) {
  const classes = createStyle()
  const [open, setOpen] = React.useState(false)
  const result = new UAParser().getResult()
  const isMobile = !!result.device.type
  const outsideClickHandler = () => {
    removeClickOutSide()
    setOpen(false)
  }
  const removeClickOutSide = () => {
    document.removeEventListener('click', outsideClickHandler)
  }
  const handleOnClick = (item) => {
    outsideClickHandler()
    props.onItemSelected(item)
  }
  const onFocus = (e) => {
    document.addEventListener("click", outsideClickHandler)
    !open && setOpen(true)
  }
  const items = props.items.map(item => (
    <div key={item.Id} onClick={() => handleOnClick(item)}>
      <span className={`${classes.item} ${classes.font}`}>{item.Descripcion}</span>
    </div>
  ))
  return (<div id="main-container" className={classes.container} onClick={(e) => e.stopPropagation()}>
    <div id="input-container" className={classes.root}>
      <input
        id="input-field" 
        className={`${classes.input} ${classes.font}`} 
        value={props.value}
        onClick={onFocus}
        onChange={props.onChange}
      />
      <label id="main-container" className={`${classes.label} ${classes.font}`}>{props.label}</label>
    </div>
    <div
      id="items-container"
      className={classes.listContainer}
      style={{display: props.items.length > 0 && open ? 'block' : 'none', height: isMobile ? '100px' : '200px'}}
    >
      {items}
    </div>
  </div>)
}

export default ListDropdown
