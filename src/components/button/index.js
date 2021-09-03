import React from 'react'
import PropTypes from 'prop-types'

import { Button as MuiButton } from '@material-ui/core'

import { createStyle } from './styles'

export default function Button({disabled, style, negative, autoFocus, label, onClick}) {
  const classes = createStyle()
  let styles = {}
  if (negative) styles = {backgroundColor: '#505050'}
  return (
    <div style={style}>
      <MuiButton variant='contained' disabled={disabled} style={styles} className={classes.button} autoFocus={autoFocus} onClick={onClick}>
        {label}
      </MuiButton>
    </div>
  )
}

Button.propTypes = {
  label: PropTypes.string.isRequired,
  negative: PropTypes.bool,
  autoFocus: PropTypes.bool,
  onClick: PropTypes.func,
  style: PropTypes.object,
  disabled: PropTypes.bool
}
