import { getBuildServerBaseUrl } from "@/lib/env";
import { unzipBlob } from "./unzip-blob";

export async function getTemplateData(id: string) {
  const res = await fetch(`${getBuildServerBaseUrl()}/template?template=${id}`);

  const blob = await res.blob();
  return unzipBlob(blob);
}

export async function getTemplateNames() {
  const res = await fetch(`${getBuildServerBaseUrl()}/templates`);
  const data = await res.json();

  return data as string[];
}