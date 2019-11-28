export const INITIAL_STATE = {
  ui: {
    isLoaderActive: false,
    loaderText: '',
    activeInfoSection: 0,
    activeHomeSection: 0,
    downloadError: ''
  },
  session: {
    authenticated: false,
    rolesPerUser: [],
    token: null,
    loginError: ''
  },
  company: {
    companyId: null,
    companyIdentifier: '',
    companyName: '',
    company: null,
    cantonList: [],
    distritoList: [],
    barrioList: [],
    reportResults: [],
    reportSummary: null,
    companyPageError: '',
    logoPageError: '',
    reportsPageError: ''
  }
}