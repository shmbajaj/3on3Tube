import "styles/common.css";
import { Header, Footer } from "components";
import { ContextWrapper } from "ContextWrapper";
import { BrowserRouter } from "react-router-dom";
import { RouteSwitch } from "./RouteSwitch";
import { ScrollToTop } from "utils";

function App() {
  return (
    <div className="dgrid App">
      <BrowserRouter>
        <ContextWrapper>
          <Header />
          <ScrollToTop />
          <RouteSwitch />
          <Footer />
        </ContextWrapper>
      </BrowserRouter>
    </div>
  );
}

export default App;
