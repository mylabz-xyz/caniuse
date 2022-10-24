import * as vscode from "vscode";
import { AnnotationProvider } from "../providers";

/**
 * CodelensService
 */
export class CodelensService {
  private static instance: CodelensService;

  public static getInstance(): CodelensService {
    if (!CodelensService.instance) {
      CodelensService.instance = new CodelensService();
    }

    return CodelensService.instance;
  }

  public register() {
    new AnnotationProvider();
  }

  public unregister() {}
}
