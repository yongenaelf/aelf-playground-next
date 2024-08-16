import { FileContent } from "@/data/db";
import { getBuildServerBaseUrl } from "@/lib/env";
import { fileContentToZip } from "@/lib/file-content-to-zip";
import { type NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { strToU8 } from "fflate";

export async function POST(request: NextRequest) {
  const { files } = (await request.json()) as { files: FileContent[] };

  if (files.some((i) => i.path.endsWith(".csproj"))) {
    const zippedData = fileContentToZip(files);

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
  } else if (files.some((i) => i.path.endsWith(".sol"))) {
    const formData = new FormData();
    const file = files[0];
    const filename = file.path.split("/").pop();
    formData.append(
      "file",
      new File([strToU8(file.contents)], filename!),
      filename!
    );
    const requestInit: RequestInit = {
      method: "POST",
      body: formData,
      redirect: "follow",
    };

    const response = await fetch(
      `${getBuildServerBaseUrl()}/api/solang/build`,
      requestInit
    );

    console.log(response);

    if (!response.ok) {
      const { message } = await response.json();
      return Response.json({ error: message }, { status: response.status });
    }

    return Response.json({ dll: (await response.json()).compileResult });
  } else {
    return Response.json({ error: "Invalid input files" }, { status: 400 });
  }
}
