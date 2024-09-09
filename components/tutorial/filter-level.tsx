import { Filter } from "@/components/listing-page/filter";

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
  return <Filter searchKey="level" title="Level" options={level} />;
}
