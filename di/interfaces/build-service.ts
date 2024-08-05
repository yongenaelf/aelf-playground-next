import { Zippable } from "fflate";
import { interfaces } from "inversify";

export interface BuildService {
  /**
   * Describes a generic build interface.
   * @param zip zip file containing files
   */
  build(zip: Zippable): Promise<string>;
}

export namespace BuildService {
  export const $: interfaces.ServiceIdentifier<BuildService> =
    Symbol("Builder");
}
