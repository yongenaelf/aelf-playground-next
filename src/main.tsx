import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from "./routes/root";
import ErrorPage from "./error-page";
import Home from "./routes/home";
import Workspaces from "./routes/workspaces";
import Workspace from "./routes/workspace";
import Tutorials from "./routes/tutorials";
import Editor from "@/components/workspace/editor";
import tutorialRoutes from "./tutorial-routes";
import Deployments from "./routes/deployments";
import Import from "./routes/import";
import Share from "./routes/share";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "workspaces",
        element: <Workspaces />,
      },
      {
        path: "workspace/:id",
        element: <Workspace />,
        children: [
          {
            path: "",
            element: <Editor />,
          }
        ]
      },
      {
        path: "tutorials",
        element: <Tutorials />,
      },
      ...tutorialRoutes,
      {
        path: "deployments",
        element: <Deployments />,
      },
      {
        path: "import",
        element: <Import />,
      },
      {
        path: "share/:id",
        element: <Share />,
      }
    ]
  },
]);

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
