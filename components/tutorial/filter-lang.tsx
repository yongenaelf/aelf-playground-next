import { Filter } from "@/components/listing-page/filter";

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
  return <Filter searchKey="lang" title="Language" options={lang} />;
}
