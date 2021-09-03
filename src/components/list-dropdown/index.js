import React from 'react'
import UAParser from 'ua-parser-js'

import { createStyle } from './styles'

function ListDropdown({items, label, value, disabled, onChange, onItemSelected}) {
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
    onItemSelected(item)
  }
  const onFocus = (e) => {
    document.addEventListener('click', outsideClickHandler)
    !open && setOpen(true)
  }
  const listItems = items.map((item, index) => (
    <div key={index} id={index} onClick={() => handleOnClick(item)}>
      <span key={index} className={`${classes.item} ${classes.font}`}>{item.Descripcion}</span>
    </div>
  ))
  return (<div id='main-container' className={classes.container} onClick={(e) => e.stopPropagation()}>
    <div id='input-container' className={classes.root}>
      <input
        disabled={disabled}
        id={`input-field-${label}`}
        className={`${classes.input} ${classes.font}`} 
        value={value}
        onClick={onFocus}
        onChange={onChange}
      />
      <label id='main-container' className={`${classes.label} ${classes.font}`}>{label}</label>
    </div>
    <div
      id='items-container'
      className={classes.listContainer}
      style={{display: items.length > 0 && open ? 'block' : 'none', height: isMobile ? '120px' : '230px'}}
    >
      {listItems}
    </div>
  </div>)
}

export default ListDropdown
