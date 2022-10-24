import { CommandsProvider } from "../providers";
import { ContextProvider } from "../providers/Context.provider";
import { CodelensService } from "./Codelens.service";
import * as vscode from "vscode";

export class CommandsService {
  private static instance: CommandsService;

  private commandsProvider = CommandsProvider.getInstance();
  private contextProvider = ContextProvider.getInstance();
  private codeLensService = CodelensService.getInstance();

  public static getInstance(): CommandsService {
    if (!CommandsService.instance) {
      CommandsService.instance = new CommandsService();
    }

    return CommandsService.instance;
  }

  public register() {
    const enableCodeLensDisposable = this.commandsProvider.register(
      "caniuse.enableCodeLens",
      () => {
        vscode.workspace
          .getConfiguration()
          .update("enableCodeLens", true, true);
      }
    );
    const disableCodeLensDisposable = this.commandsProvider.register(
      "caniuse.disableCodeLens",
      () => {
        vscode.workspace
          .getConfiguration()
          .update("enableCodeLens", false, true);
      }
    );

    this.contextProvider.setDisposable(enableCodeLensDisposable);
    this.contextProvider.setDisposable(disableCodeLensDisposable);
  }
}
