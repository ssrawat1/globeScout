import { createRoot } from "react-dom/client";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
import CountryDetail from "./components/CountryDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },

      {
        path: "/:country" /* The /:country in the route is a dynamic parameter. It means that whatever comes after the / in the URL will be treated as the country parameter, which you can access using useParams() in CountryDetail. For example, if the URL is /India, the useParams() hook will return { country: "India" }. */,
        element: <CountryDetail />,
      },
    ],
  },
]);

const root = createRoot(document.querySelector("#root"));

root.render(<RouterProvider router={router} />);
