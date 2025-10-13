import { Provider } from "react-redux";

import RoutingPage from "pages/routing-page";
import store from "state/store";

console.info("Version 1.0.0");

const App = () => (
  <Provider store={store}>
    <RoutingPage />
  </Provider>
);

export default App;
