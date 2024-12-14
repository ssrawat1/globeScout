import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemContextProvider";
import "./app.css";

const App = () => {
  return (
    <ThemeProvider>
      <Header />
      <Outlet />
    </ThemeProvider>
  );
};

export default App;
