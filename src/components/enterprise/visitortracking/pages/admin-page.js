import React from 'react'

import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { makeStyles } from '@material-ui/core/styles'

import CompanyPage from './admin/company-page'
import BranchPage from './admin/branch-page'
import UserPage from './admin/user-page'

const useStyles = makeStyles(theme => ({
  container: {
    flexGrow: 1,
    borderRadius: '8px',
    overflowY: 'auto',
    marginLeft: '150px',
    marginRight: '150px',
    padding: '25px',
    maxHeight: `${window.innerHeight - 302}px`,
    backgroundColor: 'rgba(255,255,255,0.65)'
  }
}))

function AdminPage(props) {
  const classes = useStyles()
  const [activeTab, setActiveTab] = React.useState(0)
  return (
    <div className={classes.container}>
      <Tabs
        value={activeTab}
        indicatorColor="primary"
        textColor="primary"
        onChange={(event, value) => setActiveTab(value)}
      >
        <Tab label="Empresa" />
        <Tab label="Sucursales" disabled={props.company === null || props.company.Id === undefined} />
        <Tab label="Usuarios" disabled={props.company === null || props.company.Id === undefined} />
      </Tabs>
      {activeTab === 0 && <CompanyPage { ...props } />}
      {activeTab === 1 && <BranchPage { ...props } />}
      {activeTab === 2 && <UserPage { ...props } />}
    </div>
  )
}

export default AdminPage
              