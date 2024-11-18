import { WorkspaceForm } from "@/components/new-workspace-form";
import { FileUpload } from "@/components/workspace/file-upload";
import Existing from "@/components/workspace/existing";

export function Component() {
  return (
    <div className="container grid grid-cols-1 gap-8 px-4 py-12 md:grid-cols-3 md:gap-12 md:px-6 lg:py-16">
      <div>
        <h1 className="text-2xl mb-2">Create a new workspace</h1>
        <WorkspaceForm />
        <hr className="my-8" />
        <h1 className="text-2xl mb-2">Upload files</h1>
        <FileUpload />
      </div>
      <div className="md:col-span-2">
        <h1 className="text-2xl mb-2">Open an existing workspace</h1>
        <Existing />
      </div>
    </div>
  );
}
