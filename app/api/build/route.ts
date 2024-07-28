import { FileContent } from "@/data/db";
import { getBuildServerBaseUrl } from "@/lib/env";
import { strToU8, Zippable, zipSync } from "fflate";
import { type NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  const { files } = (await request.json()) as { files: FileContent[] };
  const data: Zippable = files.reduce((acc, { path, contents }) => {
    acc[path] = strToU8(contents);

    return acc;
  }, {} as Zippable);

  const zippedData = zipSync(data);

  const formData = new FormData();
  const filePath = uuidv4() + ".zip";
  formData.append(
    "contractFiles",
    new File([zippedData], filePath, { type: "application/zip" }),
    filePath
  );

  const requestInit: RequestInit = {
    method: "POST",
    body: formData,
    redirect: "follow",
  };

  const response = await fetch(
    `${getBuildServerBaseUrl()}/playground/build`,
    requestInit
  );

  if (!response.ok) {
    const { message } = await response.json();
    return Response.json({ error: message }, { status: response.status });
  }

  return Response.json({ dll: await response.text() });
}
