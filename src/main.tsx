import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from "./error-page";
import Editor from "@/components/workspace/editor";
import HelloWorld from './tutorials/hello-world.mdx';
import HelloWorldSolidity from './tutorials/hello-world-solidity.mdx';
import LotteryGame from './tutorials/lottery-game.mdx';
import Todo from './tutorials/todo.mdx';
import VoteContract from './tutorials/vote-contract.mdx';

const router = createBrowserRouter(createRoutesFromElements(<Route path="/" lazy={() => import('./routes/root')}>
  <Route path="" lazy={() => import('./routes/home')} errorElement={<ErrorPage />} />
  <Route path="workspaces" lazy={() => import('./routes/workspaces')} />
  <Route path="workspace/:id" lazy={() => import('./routes/workspace')}>
    <Route path="" element={<Editor />} />
  </Route>
  <Route path="tutorials" lazy={() => import('./routes/tutorials')} />
  <Route path="tutorials/hello-world" lazy={() => import('./routes/workspace')}>
    <Route path="" element={<HelloWorld />} />
  </Route>
  <Route path="tutorials/hello-world-solidity" lazy={() => import('./routes/workspace')}>
    <Route path="" element={<HelloWorldSolidity />} />
  </Route>
  <Route path="tutorials/lottery-game" lazy={() => import('./routes/workspace')}>
    <Route path="" element={<LotteryGame />} />
  </Route>
  <Route path="tutorials/todo" lazy={() => import('./routes/workspace')}>
    <Route path="" element={<Todo />} />
  </Route>
  <Route path="tutorials/vote-contract" lazy={() => import('./routes/workspace')}>
    <Route path="" element={<VoteContract />} />
  </Route>
  <Route path="deployments" lazy={() => import('./routes/deployments')} />
  <Route path="import" lazy={() => import('./routes/import')} />
  <Route path="share/:id" lazy={() => import('./routes/share')} />
</Route>));

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
