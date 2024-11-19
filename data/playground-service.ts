import { FileContent } from "@/data/db";
import { fileContentToZip } from "@/lib/file-content-to-zip";
import { strFromU8, unzipSync } from "fflate";
import { v4 as uuidv4 } from "uuid";

export class PlaygroundService {
  async build(files: FileContent[]) {
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
      "/playground/build",
      requestInit
    );

    if (!response.ok) {
      const { message } = await response.json();
      throw new Error(message);
    }

    const content = await response.text();

    if (content.includes("Determining projects to restore")) {
      throw new Error(content);
    }

    return {dll: content}
  }

  async test(files: FileContent[]) {
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
      "/playground/test",
      requestInit
    );

    return { message: await response.text() };
  }

  async getShare(id: string) {
    const res = await fetch(
      `/playground/share/get/${id}`
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

    return files;
  }

  async getTemplateNames() {
    const res = await fetch(`/playground/templates`);
    const data = await res.json();

    return data as string[];
  }

  async getTemplateData(id: string, name: string) {
    return await this.getTemplateDataRecursive(id, name);
  }

  private async getTemplateDataRecursive(id: string, name: string): Promise<FileContent[]> {
    const res = await fetch(
      `/playground/template?template=${id}&projectName=${name}`
    );
    const data = await res.text();
    const zipData = Buffer.from(data, "base64");
    const files = unzipSync(zipData);
    const length = Object.keys(files).length;
    if (length === 0) {
      // wait for 1 second
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return await this.getTemplateDataRecursive(id, name);
    } else {
      let fileContents: FileContent[] = [];
  
      Object.entries(files).forEach(([k, v]) => {
        fileContents.push({
          path: k,
          contents: strFromU8(v),
        });
      });
      return fileContents;
    }
  }

  async createShare(files: FileContent[]) {
    const zippedData = fileContentToZip(files);

    const formData = new FormData();
    const filePath = uuidv4() + ".zip";
    formData.append(
      "file",
      new File([zippedData], filePath, { type: "application/zip" }),
      filePath
    );

    const requestInit: RequestInit = {
      method: "POST",
      body: formData,
      redirect: "follow",
    };

    const response = await fetch(
      `/playground/share/create`,
      requestInit
    );

    return await response.json();
  }
}

export const playgroundService = new PlaygroundService();