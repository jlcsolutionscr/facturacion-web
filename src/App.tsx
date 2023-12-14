import { Provider } from "react-redux";

import store from "state/store";
import RoutingPage from "pages/routing-page";

const App = () => {
  return (
    <Provider store={store}>
      <RoutingPage />
    </Provider>
  );
};

export default App;
