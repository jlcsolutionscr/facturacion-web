import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles'

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import StepOneScreen from './invoice-steps/step-one-screen'
import StepTwoScreen from './invoice-steps/step-two-screen'
import StepThreeScreen from './invoice-steps/step-three-screen'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden'
  }
}))

function InvoicePage() {
  const classes = useStyles()
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.container}>
      <Tabs
        value={value}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
        aria-label="disabled tabs example"
      >
        <Tab label="Cliente"/>
        <Tab label="Detalle"/>
        <Tab label="Generar"/>
      </Tabs>
      <StepOneScreen value={value} index={0} />
      <StepTwoScreen value={value} index={1} />
      <StepThreeScreen value={value} index={2} />
    </div>
  )
}

export default InvoicePage
