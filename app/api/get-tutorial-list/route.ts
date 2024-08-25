import { getSolidityEnabled } from "@/lib/env";

export async function GET() {
  const solidityEnabled = getSolidityEnabled();

  const data = [
    {
      id: "hello-world",
      img: "/hello-world.jpeg",
      title: "Hello World Contract",
      description: "Simplest contract to get you started",
      level: "Beginner",
      levelId: "beginner",
      lang: "C#",
      langId: "csharp",
    },
    {
      id: "hello-world-solidity",
      img: "/hello-world.jpeg",
      title: "Hello World Contract",
      description: "Simplest contract to get you started",
      level: "Beginner",
      levelId: "beginner",
      lang: "Solidity",
      langId: "solidity",
    },
    {
      id: "vote-contract",
      img: "/vote.jpeg",
      title: "Vote Contract",
      description:
        "Voting mechanisms, security considerations, and advanced data structures",
      level: "Intermediate",
      levelId: "intermediate",
      lang: "C#",
      langId: "csharp",
    },
    {
      id: "lottery-game",
      img: "/lottery.jpeg",
      title: "Lottery Game Contract",
      description:
        "State variables, user interactions, and random number generation",
      level: "Advanced",
      levelId: "advanced",
      lang: "C#",
      langId: "csharp",
    },
  ].filter((i) => (solidityEnabled ? true : i.langId !== "solidity"));

  return Response.json(data);
}
