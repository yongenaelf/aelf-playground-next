import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { ModeToggle } from "./mode-toggle";
import Modal from "./modal";
import { TemplatesMenu } from "./templates-menu";

export function MenubarComponent() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>New</MenubarTrigger>
        <MenubarContent>
          <TemplatesMenu />
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Theme</MenubarTrigger>
        <MenubarContent>
          <ModeToggle />
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>
          <Modal
            trigger={<span>Chat</span>}
            title="Chat"
            body={<>Put your component here.</>}
          />
        </MenubarTrigger>
      </MenubarMenu>
    </Menubar>
  );
}
