import { FileContent } from "@/data/db";
import { strFromU8, strToU8 } from "fflate";

export class SolangBuildService {
  async build(files: FileContent[]) {
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
      `/api/solang/build`,
      requestInit
    );

    const { compileResult } = (await response.json()) || {};

    const str = strFromU8(Buffer.from(compileResult, "base64"));

    return {dll: str}
  }
}

export const solangBuildService = new SolangBuildService();