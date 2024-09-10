import { FileContent } from "@/data/db";
import { getBuildServerBaseUrl } from "@/lib/env";
import { unzipSync, strFromU8 } from "fflate";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    throw new Error("no id");
  }

  const res = await fetch(
    `${getBuildServerBaseUrl()}/playground/share/get/${id}`
  );

  const data = await res.arrayBuffer();

  try {
    const unzipped = unzipSync(Buffer.from(data));

    let files: FileContent[] = [];

    Object.entries(unzipped).forEach(([k, v]) => {
      files.push({
        path: k,
        contents: strFromU8(v)
      })
    })

    return Response.json(files);
  } catch (err) {
    if (err instanceof Error) {
      return Response.json({ message: err.message }, { status: 500 });
    }
  }
}
