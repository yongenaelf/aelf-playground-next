import { FileContent } from "@/data/db";
import { unzipBlob } from "@/data/unzip-blob";
import { getBuildServerBaseUrl } from "@/lib/env";
import { strFromU8 } from "fflate";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    throw new Error("no id");
  }

  try {
    const res = await fetch(`${getBuildServerBaseUrl()}/share/get?key=${id}`);

    const blob = await res.blob();

    const unzipped = await unzipBlob(blob);

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
