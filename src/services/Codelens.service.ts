import * as vscode from "vscode";
import { CodelensProvider } from "../providers";

/**
 * CodelensService
 */
export class CodelensService {
  private static instance: CodelensService;

  private codelensProvider = CodelensProvider.getInstance();

  public static getInstance(): CodelensService {
    if (!CodelensService.instance) {
      CodelensService.instance = new CodelensService();
    }

    return CodelensService.instance;
  }

  public register() {
    vscode.languages.registerCodeLensProvider(
      { language: "css" },
      this.codelensProvider
    );

    vscode.languages.registerCodeLensProvider(
      { language: "scss" },
      this.codelensProvider
    );
  }

  public unregister() {}
}
