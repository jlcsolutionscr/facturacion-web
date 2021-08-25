import React from 'react'

import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'

import { DarkModeIcon, LightModeIcon, LogOutIcon } from 'utils/iconsHelper'
import { createStyle } from './styles'

function Header({ companyName, companyIdentifier, isDarkMode, toggleDarkMode, logOut }) {
  const classes = createStyle()
  const title = companyName
  const identification = companyIdentifier.length === 9
    ? companyIdentifier.substring(0,1) + '-' + companyIdentifier.substring(1,5) + '-' + companyIdentifier.substring(5)
    : companyIdentifier.length === 10
      ? companyIdentifier.substring(0,1) + '-' + companyIdentifier.substring(1,4) + '-' + companyIdentifier.substring(4)
      : companyIdentifier
  return (
    <div className={classes.header}>
      <div className={classes.banner} />
      <Tooltip title="Cambiar tema" aria-label="cambiar tema">
        <IconButton className={classes.toogle} aria-label='upload picture' component='span' onClick={() => toggleDarkMode(!isDarkMode)}>
          {isDarkMode ? <DarkModeIcon className={classes.icon} /> : <LightModeIcon className={classes.icon} />}
        </IconButton>
      </Tooltip>
      <Tooltip title="Cerrar sessión" aria-label="cerrar sessión">
        <IconButton className={classes.logout} aria-label='upload picture' component='span' onClick={() => logOut()}>
          <LogOutIcon className={classes.icon} />
        </IconButton>
      </Tooltip>
      <div className={classes.text}>
        <Typography classes={{h2: classes.h2}} variant='h2' component='h2'>
          JLC Solutions
        </Typography>
        <Typography classes={{h4: classes.h4}} variant='h4' component='h4'>
          Facturación Electrónica
        </Typography>
      </div>
      <div className={classes.title}>
        <Typography className={classes.companyText} align='center' paragraph>
          {title}
        </Typography>
        <Typography className={classes.companyText} align='center' paragraph>
          {identification}
        </Typography>
      </div>
    </div>
  )
}

export default Header
