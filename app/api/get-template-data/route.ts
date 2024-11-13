import { getTemplateData } from "@/data/template";
import { strFromU8 } from "fflate";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id"),
    name = searchParams.get("name");

  if (!id) {
    throw new Error("no id");
  }
  if (!name) {
    throw new Error("no name");
  }

  let res = await getTemplateDataRecursive(id, name);

  const data = Object.entries(res).map(([key, value]) => ({
    path: encodeURIComponent(key),
    contents: strFromU8(value),
  }));

  return Response.json(data);
}

async function getTemplateDataRecursive(id: string, name: string) {
  const res = await getTemplateData(id, name);

  const length = Object.keys(res).length;
  if (length === 0) {
    // wait for 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return await getTemplateDataRecursive(id, name);
  }

  return res;
}