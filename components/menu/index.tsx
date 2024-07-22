import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { ModeToggle } from "@/components/menu/mode-toggle";
import Modal from "@/components/modal";
import { WorkspaceForm } from "@/components/menu/new-workspace-form";
import { getTemplateNames } from "@/data/template";
import { OpenWorkspaceForm } from "./open-workspace-form";

export async function MenubarComponent() {
  const templateOptions = await getTemplateNames();
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>
          <Modal trigger={<span>New</span>} title="New Workspace">
            <WorkspaceForm templateOptions={templateOptions} />
          </Modal>
        </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>
          <Modal trigger={<span>Open</span>} title="Open Workspace">
            <OpenWorkspaceForm />
          </Modal>
        </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Theme</MenubarTrigger>
        <MenubarContent>
          <ModeToggle />
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>
          <Modal trigger={<span>Chat</span>} title="Chat">
            <>Put your component here.</>
          </Modal>
        </MenubarTrigger>
      </MenubarMenu>
    </Menubar>
  );
}
