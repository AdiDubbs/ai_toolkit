import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home.tsx";
import Caption from "./pages/tools/Caption.tsx";
import Summarize from "./pages/tools/Summarize.tsx";
import About from "./pages/About.tsx";
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
        path: "/about",
        element: <About />,
      },
      {
        path: "/caption",
        element: <Caption />,
      },
      {
        path: "/summarize",
        element: <Summarize />,
      },
    ],
  },
]);

export default router;
