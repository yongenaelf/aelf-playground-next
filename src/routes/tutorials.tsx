import { TutorialLangFilter } from "@/components/tutorial/filter-lang";
import { TutorialLevelFilter } from "@/components/tutorial/filter-level";
import { TutorialList } from "@/components/tutorial/list";
import { TutorialSearch } from "@/components/tutorial/search";

export default function Tutorials() {
  return (
    <div className="container grid grid-cols-1 gap-8 px-4 py-12 md:grid-cols-3 md:gap-12 md:px-6 lg:py-16">
      <div>
        <h1 className="text-2xl mb-2">Filter</h1>
        <TutorialLevelFilter />
        <hr className="my-4" />
        <TutorialLangFilter />
      </div>
      <div className="md:col-span-2">
        <div className="flex justify-between">
          <h1 className="text-2xl mb-2">Tutorial Listing</h1>
          <TutorialSearch />
        </div>
        <TutorialList />
      </div>
    </div>
  );
}
