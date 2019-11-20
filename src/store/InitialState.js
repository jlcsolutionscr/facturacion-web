export const INITIAL_STATE = {
  ui: {
    isLoaderActive: false,
    loaderText: '',
    activeMenuPage: 0,
    menuPageTitle: 'Página de inicio',
    downloadError: ''
  },
  session: {
    authenticated: false,
    company: null,
    branchList: [],
    terminalList: [],
    branch: null,
    terminal: null,
    token: null,
    loginError: ''
  }
}