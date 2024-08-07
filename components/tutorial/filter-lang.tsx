import { TutorialFilter } from "./filter";

const lang = [
  {
    id: "csharp",
    label: "C#",
  },
  {
    id: "solidity",
    label: "Solidity",
  },
];

export function TutorialLangFilter() {
  return <TutorialFilter searchKey="lang" title="Language" options={lang} />;
}
