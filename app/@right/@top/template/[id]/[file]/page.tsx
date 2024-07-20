import Editor from "@/components/editor";
import { getLang } from "@/components/editor-enum";
import { getTemplateData } from "@/data/template";
import { strFromU8 } from "fflate";

export default async function Page({
  params: { id, file },
}: {
  params: { id: string; file: string };
}) {
  const data = await getTemplateData(id);
  const [_, fileData] =
    Object.entries(data).find(([key]) => key === decodeURIComponent(file)) ||
    [];

  return <Editor defaultValue={strFromU8(fileData!)} lang={getLang(file)} />;
}
