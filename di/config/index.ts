"use client";

import "reflect-metadata";

import { Container } from "inversify";
import { BuildService } from "@/di/interfaces";
import { CSharpBuildService, SolidityBuildService } from "@/di/services";
import { BUILD_TYPE } from "@/di/constants/build";

let container = new Container();

container
  .bind<BuildService>(BuildService.$)
  .to(CSharpBuildService)
  .whenTargetNamed(BUILD_TYPE.CSHARP);
container
  .bind<BuildService>(BuildService.$)
  .to(SolidityBuildService)
  .whenTargetNamed(BUILD_TYPE.SOLIDITY);

export default container;
