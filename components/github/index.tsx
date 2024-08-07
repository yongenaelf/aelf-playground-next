"use client";

import { useState } from "react";
import { RepoUrlForm } from "./repo-url-form";
import { RepoSelectFiles } from "./repo-select-files";

export default function GitHub() {
  const [repo, setRepo] = useState<string>();
  const [branch, setBranch] = useState<string>();
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <>
      <RepoUrlForm
        onSubmit={async ({ repo, branch }) => {
          setRepo(repo);
          setBranch(branch);
        }}
      />
      {repo && (
        <RepoSelectFiles
          repo={repo}
          branch={branch}
          onSubmit={async (paths) => {
            setSelected(paths);
          }}
        />
      )}
      {selected.length > 0 && <div>{selected.join(", ")} selected.</div>}
    </>
  );
}
