import FileExplorer from "@/components/file-explorer";
import { getTemplateData } from "@/data/template";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const data = await getTemplateData(id);

  return (
    <>
      <FileExplorer
        paths={Object.keys(data).sort((a, b) => a.localeCompare(b))}
        pathname={`/template/${id}`}
      />
    </>
  );
}
