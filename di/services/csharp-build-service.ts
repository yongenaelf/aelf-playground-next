import { injectable } from "inversify";
import { BuildService } from "@/di/interfaces";
import { Zippable } from "fflate";

@injectable()
export class CSharpBuildService implements BuildService {
  async build(zip: Zippable) {
    return "This is csharp builder.";
  }
}
