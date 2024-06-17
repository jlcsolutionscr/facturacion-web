import { Provider } from "react-redux";

import RoutingPage from "pages/routing-page";
import store from "state/store";

const App = () => (
  <Provider store={store}>
    <RoutingPage />
  </Provider>
);

export default App;
