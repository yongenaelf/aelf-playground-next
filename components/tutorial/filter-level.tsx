import { TutorialFilter } from "./filter";

const level = [
  {
    id: "beginner",
    label: "Beginner",
  },
  {
    id: "intermediate",
    label: "Intermediate",
  },
  {
    id: "advanced",
    label: "Advanced",
  },
];

export function TutorialLevelFilter() {
  return <TutorialFilter searchKey="level" title="Level" options={level} />;
}
