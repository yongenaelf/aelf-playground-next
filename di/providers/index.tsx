"use client";

import { Provider, useContainer } from "inversify-react";
import container from "@/di/config";
import { BuildService } from "../interfaces";
import { BUILD_TYPE } from "../constants/build";

export function InversifyProvider({ children }: React.PropsWithChildren) {
  return <Provider container={container}>{children}</Provider>;
}

export function useBuildService(service: BUILD_TYPE) {
  return useContainer((container) =>
    container.getNamed(BuildService.$, service)
  );
}
