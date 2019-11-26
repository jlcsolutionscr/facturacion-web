import sessionJson from './session.json'

export const INITIAL_STATE = {
  ui: {
    isLoaderActive: false,
    loaderText: '',
    activeHomeSection: 0,
    downloadError: ''
  },
  session: {
    authenticated: true,
    rolesPerUser: sessionJson.RolePorUsuario,
    activeHomeSection: 0,
    companyId: sessionJson.UsuarioPorEmpresa[0].IdEmpresa,
    companyIdentifier: sessionJson.UsuarioPorEmpresa[0].Empresa.Identificacion,
    companyName: sessionJson.UsuarioPorEmpresa[0].Empresa.NombreEmpresa,
    company: null,
    cantonList: [],
    distritoList: [],
    barrioList: [],
    token: sessionJson.Token,
    loginError: '',
    companyPageError: ''
  }
}