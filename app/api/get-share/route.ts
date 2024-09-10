import { getBuildServerBaseUrl } from "@/lib/env";
import { unzipSync } from "fflate";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    throw new Error("no id");
  }

  const res = await fetch(
    `${getBuildServerBaseUrl()}/playground/share/get/${id}`
  );

  const data = await res.text();

  const zipData = Buffer.from(data, "base64");

  const unzipped = unzipSync(zipData);

  return Response.json(unzipped);
}
