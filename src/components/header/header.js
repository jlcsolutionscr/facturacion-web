import React from 'react'

import Typography from '@material-ui/core/Typography'

import { createStyle } from './styles'

function Header({ companyName, companyIdentifier }) {
  const classes = createStyle()
  const title = companyName
  const identification = companyIdentifier.length === 9
    ? companyIdentifier.substring(0,1) + '-' + companyIdentifier.substring(1,5) + '-' + companyIdentifier.substring(5)
    : companyIdentifier.length === 10
      ? companyIdentifier.substring(0,1) + '-' + companyIdentifier.substring(1,4) + '-' + companyIdentifier.substring(4)
      : companyIdentifier
  return (
    <div className={classes.header}>
      <div className={classes.banner}>
        <Typography classes={{h2: classes.h2}} variant='h2' component='h2'>
          JLC Solutions
        </Typography>
        <Typography classes={{h4: classes.h4}} variant='h4' component='h4'>
          A software development company
        </Typography>
      </div>
      <div>
        <Typography className={classes.title} align='center' paragraph>
          {title}
        </Typography>
        <Typography className={classes.title} align='center' paragraph>
          {identification}
        </Typography>
      </div>
    </div>
  )
}

export default Header
