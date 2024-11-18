import { useMemo } from "react";
import { useRepoTree } from "./use-octokit";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function ProjectSelection({
  repo,
  branch,
  onSelect,
}: {
  repo?: string;
  branch?: string;
  onSelect?: (val: string[]) => void;
}) {
  const { data: repoData, isLoading } = useRepoTree(repo, branch);

  const data = useMemo(() => {
    if (!!repoData) {
      return repoData.filter(
        (i) => i.path?.endsWith(".csproj") && !i.path.endsWith(".Tests.csproj")
      );
    }

    return undefined;
  }, [repoData]);

  const _onSelect = (val: string) => {
    const parentFolder = val.split("/").slice(0, -2).join("/");

    if (!repoData) return;

    onSelect?.(repoData.filter(i => parentFolder ? i.path?.startsWith(parentFolder + "/") : true).map(i => i.path!));
  }

  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <Select onValueChange={e => _onSelect(e)}>
      <SelectTrigger>
        <SelectValue placeholder="Select project" />
      </SelectTrigger>
      <SelectContent>
        {data.map(i => <SelectItem key={i.path} value={i.path || ''}>{i.path}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

export default ProjectSelection;
