import companyJson from './company.json'

export const INITIAL_STATE = {
  ui: {
    isLoaderActive: false,
    loaderText: '',
    activeHomeSection: 0,
    downloadError: ''
  },
  session: {
    authenticated: true,
    activeHomeSection: 0,
    company: companyJson,
    branchList: [],
    terminalList: [],
    branch: null,
    terminal: null,
    token: null,
    loginError: ''
  }
}