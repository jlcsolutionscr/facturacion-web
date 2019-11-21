import React from 'react'

import MobileAppCard from './mobile-app-card'
import PlatformCard from './platform-card'
import WindowsAppCard from './windows-app-card'

const style = {
  paddingTop: '1%',
  paddingBottom: '4%',
  display: 'flex',
  flexDirection: 'row',
  alignontent: 'space-between',
  paddingLeft: '6%',
  color: 'black',
  backgroundColor: 'white'
}

const item = {
  width: '33%'
}

function HomePage(props) {
  return (
    <div style={style}>
      <div style={item}><MobileAppCard onClick={props.onClick} /></div>
      <div style={item}><WindowsAppCard onClick={props.onClick}/></div>
      <div style={item}><PlatformCard onClick={props.onClick}/></div>
    </div>
  )
}

export default HomePage
