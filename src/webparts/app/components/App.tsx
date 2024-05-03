import * as React from "react";
import "./Style.css";
import "./Theme.css";
import { Provider } from "react-redux";
import { Store } from "./Redux/Store/Store";
import Announce from "./Pages/Announcement/Announce";

const App = (): JSX.Element => {
  return (
    <Provider store={Store}>
      <div className="AppContainer">
        <Announce />
      </div>
    </Provider>
  );
};

export default App;
