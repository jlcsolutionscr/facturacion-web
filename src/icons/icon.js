import React from 'react'
import SvgIcon from '@material-ui/core/SvgIcon'

export const ListIcon = React.forwardRef((props, ref) => (
  <SvgIcon {...props} ref={ref}>
    <path d="M0 0h24v24H0z" fill="none"/><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
  </SvgIcon>
))

export const ExpandMoreIcon = React.forwardRef((props, ref) => (
  <SvgIcon {...props} ref={ref}>
    <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
  </SvgIcon>
))

export const CheckIcon = React.forwardRef((props, ref) => (
  <SvgIcon {...props} ref={ref}>
    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
  </SvgIcon>
))
