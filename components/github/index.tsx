"use client";

import { useState } from "react";
import { RepoUrlForm } from "./repo-url-form";
import { RepoSelectFiles } from "./repo-select-files";
import { X } from "lucide-react";
import { RepoBranchSelection } from "./repo-branch-selection";
import { RepoWorkspaceName } from "./repo-workspace-name";

export default function GitHub() {
  const [repo, setRepo] = useState<string>();
  const [branch, setBranch] = useState<string>();
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <>
      {repo ? (
        <div className="mb-8">
          <p>Currently selected repo:</p>
          <p>
            <b>{repo}</b>{" "}
            <button
              className="text-red-600 hover:font-bold"
              onClick={() => setRepo(undefined)}
            >
              <X className="inline w-4" />
              reset
            </button>
          </p>
        </div>
      ) : (
        <RepoUrlForm
          onSubmit={async ({ repo, branch }) => {
            setRepo(repo);
            setBranch(branch);
          }}
        />
      )}
      {repo ? (
        <>
          {branch ? (
            <p className="mb-8">
              You have selected <b>{branch}</b> branch.{" "}
              <button
                className="text-red-600 hover:font-bold"
                onClick={() => {
                  setBranch(undefined);
                }}
              >
                <X className="inline w-4" />
                reset
              </button>
            </p>
          ) : (
            <RepoBranchSelection
              repo={repo}
              onSubmit={({ branch }) => setBranch(branch)}
            />
          )}
          {branch && selected.length === 0 ? (
            <RepoSelectFiles
              repo={repo}
              branch={branch}
              onSubmit={async (paths) => {
                setSelected(paths);
              }}
            />
          ) : null}
        </>
      ) : null}
      {selected.length > 0 && repo && branch ? (
        <div>
          {selected.length} files or folders selected.{" "}
          <button
            className="text-red-600 hover:font-bold"
            onClick={() => {
              setSelected([]);
            }}
          >
            <X className="inline w-4" />
            reset
          </button>
          <RepoWorkspaceName repo={repo} branch={branch} paths={selected} />
        </div>
      ) : null}
    </>
  );
}
