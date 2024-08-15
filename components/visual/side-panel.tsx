"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVisualEditorContext } from "./context";
import { SendMethodEditor } from "./send-method-editor";
import { ViewMethodEditor } from "./view-method-editor";

export function SidePanel() {
  const { state, setState } = useVisualEditorContext();

  return (
    <Tabs defaultValue="state">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="state">State</TabsTrigger>
        <TabsTrigger value="methods">Methods</TabsTrigger>
      </TabsList>
      <TabsContent value="state">
        <Card>
          <CardHeader>
            <CardTitle>State</CardTitle>
            <CardDescription>Make changes to your state here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={state.name}
                placeholder="Hello World"
                onChange={(e) =>
                  setState((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="methods">
        <Card>
          <CardHeader>
            <CardTitle>Methods</CardTitle>
            <CardDescription>Change your methods here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="view">View methods</Label>
              <ViewMethodEditor
                value={state.viewMethods}
                onChange={(e) => setState((p) => ({ ...p, viewMethods: e }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="send">Send methods</Label>
              <SendMethodEditor
                value={state.sendMethods}
                onChange={(e) => setState((p) => ({ ...p, sendMethods: e }))}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
