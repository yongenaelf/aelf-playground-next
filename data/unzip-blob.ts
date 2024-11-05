import { unzipSync } from "fflate";

export async function unzipBlob(blob: Blob) {
  const arrayBuffer = await blob.arrayBuffer();
  return unzipSync(new Uint8Array(arrayBuffer));
}
