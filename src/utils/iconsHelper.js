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

export const CloudDownloadIcon = React.forwardRef((props, ref) => (
  <SvgIcon {...props} ref={ref}>
    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/>
  </SvgIcon>
))

export const ErrorIcon = React.forwardRef((props, ref) => (
  <SvgIcon {...props} ref={ref}>
    <path d='M0 0h24v24H0z' fill='none'/>
    <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'/>
  </SvgIcon>
))

export const InfoIcon = React.forwardRef((props, ref) => (
  <SvgIcon {...props} ref={ref}>
    <path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
  </SvgIcon>
))

export const StarIcon = React.forwardRef((props, ref) => (
  <SvgIcon {...props} ref={ref}>
    <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/>
    <path d="M0 0h24v24H0z" fill="none"/>
  </SvgIcon>
))

export const DeleteIcon = React.forwardRef((props, ref) => (
  <SvgIcon {...props} ref={ref}>
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/><path d="M0 0h24v24H0z" fill="none"/>
  </SvgIcon>
))

export const BackArrowIcon = React.forwardRef((props, ref) => (
  <SvgIcon {...props} ref={ref}>
    <path d="M0 0h24v24H0z" fill="none"/><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
  </SvgIcon>
))

export const AddCircleIcon = React.forwardRef((props, ref) => (
  <SvgIcon {...props} ref={ref}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
  </SvgIcon>
))

export const RemoveCircleIcon = React.forwardRef((props, ref) => (
  <SvgIcon {...props} ref={ref}>
    <path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/>
  </SvgIcon>
))

export const FirstPageIcon = React.forwardRef((props, ref) => (
  <SvgIcon {...props} ref={ref}>
    <path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"/><path d="M24 24H0V0h24v24z" fill="none"/>
  </SvgIcon>
))

export const KeyboardArrowLeftIcon = React.forwardRef((props, ref) => (
  <SvgIcon {...props} ref={ref}>
    <path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
  </SvgIcon>
))

export const KeyboardArrowRightIcon = React.forwardRef((props, ref) => (
  <SvgIcon {...props} ref={ref}>
    <path d="M0 0h24v24H0V0z" fill="none"/><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
  </SvgIcon>
))

export const LastPageIcon = React.forwardRef((props, ref) => (
  <SvgIcon {...props} ref={ref}>
    <path d="M0 0h24v24H0V0z" fill="none"/><path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"/>
  </SvgIcon>
))

export const EmailIcon = React.forwardRef((props, ref) => (
  <SvgIcon {...props} ref={ref}>
    <path d="M0 0h24v24H0z" fill="none"/><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </SvgIcon>
))

export const DarkModeIcon = React.forwardRef((props, ref) => (
  <SvgIcon {...props} ref={ref}>
    <path d="M0 0h24v24H0z" fill="none"/><path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
  </SvgIcon>
))

export const LightModeIcon = React.forwardRef((props, ref) => (
  <SvgIcon {...props} ref={ref}>
    <path d="M0 0h24v24H0z" fill="none"/><path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-.89 0-1.74-.2-2.5-.55C11.56 16.5 13 14.42 13 12s-1.44-4.5-3.5-5.45C10.26 6.2 11.11 6 12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6z"/>
  </SvgIcon>
))

export const LogOutIcon = React.forwardRef((props, ref) => (
  <SvgIcon {...props} ref={ref}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
  </SvgIcon>
))

export const DownloadPdfIcon = React.forwardRef((props, ref) => (
  <SvgIcon {...props} ref={ref}>
    <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"/>
  </SvgIcon>
))