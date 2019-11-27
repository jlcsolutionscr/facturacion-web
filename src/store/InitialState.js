export const INITIAL_STATE = {
  ui: {
    isLoaderActive: false,
    loaderText: '',
    activeHomeSection: 0,
    downloadError: ''
  },
  session: {
    authenticated: false,
    rolesPerUser: [],
    activeHomeSection: 0,
    companyId: null,
    companyIdentifier: '',
    companyName: '',
    company: null,
    cantonList: [],
    distritoList: [],
    barrioList: [],
    token: null,
    loginError: '',
    companyPageError: '',
    logoPageError: '',
    reportsPageError: ''
  }
}