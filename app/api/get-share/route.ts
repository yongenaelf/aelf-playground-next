import { FileContent } from "@/data/db";
import { getBuildServerBaseUrl } from "@/lib/env";
import { unzipSync, strFromU8 } from "fflate";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    throw new Error("no id");
  }

  try {
    const res = await fetch(
      `${getBuildServerBaseUrl()}/playground/share/get/${id}`
    );

    const data = await res.arrayBuffer();

    const unzipped = unzipSync(Buffer.from(data));

    let files: FileContent[] = [];

    Object.entries(unzipped).forEach(([k, v]) => {
      files.push({
        path: k,
        contents: strFromU8(v),
      });
    });

    return Response.json({ files, success: true });
  } catch (err) {
    if (err instanceof Error) {
      let error = err.message;

      if (error === "invalid zip data")
        error = "This share ID is not available.";

      return Response.json({ message: error, success: false });
    }
  }
}
