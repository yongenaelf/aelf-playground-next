import { useShare } from "@/data/client";
import { db } from "@/data/db";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Share() {
  const { id } = useParams();
  const { data, isLoading } = useShare(id);
  const navigate = useNavigate();

  useEffect(() => {
    async function importWorkspace() {
      if (!data?.files || !id) return;

      const existing = await db.workspaces.get(id);
      if (existing) {
        navigate(`/workspace/${id}`);
      } else {
        await db.workspaces.add({ name: id, template: id, dll: "" });

        await db.files.bulkAdd(
          data.files.map(({ path, contents }) => ({
            path: `/workspace/${id}/${encodeURIComponent(path)}`,
            contents,
          }))
        );
        navigate(`/workspace/${id}`);
      }
    }

    importWorkspace();
  }, [id, data]);

  if (data?.success === false)
    return (
      <Dialog open onOpenChange={() => navigate("/")}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>{data.message}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  if (isLoading) return <p>Loading...</p>;

  return <p>Loading...</p>;
}
