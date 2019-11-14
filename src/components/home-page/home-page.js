import React from 'react'

import MobileAppCard from './mobile-app-card'
import PlatformCard from './platform-card'
import WindowsAppCard from './windows-app-card'

const style = {
  display: 'flex',
  flexDirection: 'row',
  color: 'white'
}

function HomePage(props) {
  return (
    <div style={style}>
      <MobileAppCard onClick={props.onClick} />
      <WindowsAppCard onClick={props.onClick}/>
      <PlatformCard onClick={props.onClick}/>
    </div>
  )
}

export default HomePage
