import RoutingPage from "pages/routing-page";
import { Provider } from "react-redux";

import store from "state/store";

const App = () => {
  return (
    <Provider store={store}>
      <RoutingPage />
    </Provider>
  );
};

export default App;
