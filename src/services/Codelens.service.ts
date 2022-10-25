import * as vscode from "vscode";
import { AnnotationProvider } from "../providers";
import { HoverProvider } from "../providers/Hover.provider";

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
    // new AnnotationProvider();
    new HoverProvider();
  }

  public unregister() {}
}
