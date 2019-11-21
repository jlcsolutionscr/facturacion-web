export const INITIAL_STATE = {
  ui: {
    isLoaderActive: false,
    loaderText: '',
    activeHomeSection: 0,
    downloadError: ''
  },
  session: {
    authenticated: true,
    company: null,
    branchList: [],
    terminalList: [],
    branch: null,
    terminal: null,
    token: null,
    loginError: ''
  }
}