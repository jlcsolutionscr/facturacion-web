import React from 'react'

import MobileAppCard from './mobile-app-card'
import PlatformCard from './platform-card'
import WindowsAppCard from './windows-app-card'
import { createStyle } from '../styles'

const style = {
  display: 'flex',
  flexDirection: 'row',
  color: 'white'
}

function HomePage(props) {
  const classes = createStyle('white')
  return (
    <div className={classes.root} style={style}>
      <MobileAppCard onClick={props.onClick} />
      <WindowsAppCard onClick={props.onClick}/>
      <PlatformCard onClick={props.onClick}/>
    </div>
  )
}

export default HomePage
