import React, { useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeStyles } from '@material-ui/core/styles'

import { setActiveSection } from 'store/ui/actions'

import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import IconButton from '@material-ui/core/IconButton'

import { BackArrowIcon } from 'utils/iconsHelper'
import StepOneScreen from './invoice-steps/step-one-screen'
import StepTwoScreen from './invoice-steps/step-two-screen'
import StepThreeScreen from './invoice-steps/step-three-screen'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden',
    backgroundColor: theme.palette.background.navbar,
    color: theme.palette.primary.navbar,
    maxWidth: '900px',
    margin: '10px auto 0 auto'
  },
  backButton: {
    position: 'absolute',
    zIndex: '10'
  },
  icon: {
    color: '#FFF'
  }
}))

function InvoicePage({setActiveSection}) {
  const classes = useStyles()
  const [value, setValue] = useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <div className={classes.container}>
      <div className={classes.backButton}>
        <IconButton aria-label='upload picture' component='span' onClick={() => setActiveSection(0)}>
          <BackArrowIcon className={classes.icon} />
        </IconButton>
      </div>
      <Tabs centered value={value} indicatorColor='secondary' onChange={handleChange}
      >
        <Tab label='Cliente'/>
        <Tab label='Detalle'/>
        <Tab label='Generar'/>
      </Tabs>
      <StepOneScreen value={value} index={0} />
      <StepTwoScreen value={value} index={1} />
      <StepThreeScreen value={value} setValue={setValue} index={2} />
    </div>
  )
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({setActiveSection}, dispatch)
}

export default connect(null, mapDispatchToProps)(InvoicePage)
