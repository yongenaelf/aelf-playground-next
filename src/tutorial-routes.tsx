import Workspace from "./routes/workspace";
import Tutorial from "./routes/tutorial";
import { RouteObject } from "react-router-dom";
import HelloWorld from './tutorials/hello-world.mdx';
import HelloWorldSolidity from './tutorials/hello-world-solidity.mdx';
import LotteryGame from './tutorials/lottery-game.mdx';
import Todo from './tutorials/todo.mdx';
import VoteContract from './tutorials/vote-contract.mdx';

const tutorials = ["hello-world", "hello-world-solidity", "lottery-game", "todo", "vote-contract"];

const routes: RouteObject[] = tutorials.map((tutorial) => ({
    path: `tutorials/${tutorial}`,
    element: <Workspace />,
    children: [
      {
        path: "",
        element: <Tutorial>
            {tutorial === "hello-world" && <HelloWorld />}
            {tutorial === "hello-world-solidity" && <HelloWorldSolidity />}
            {tutorial === "lottery-game" && <LotteryGame />}
            {tutorial === "todo" && <Todo />}
            {tutorial === "vote-contract" && <VoteContract />}
        </Tutorial>,
      },
    ]
}));

export default routes;