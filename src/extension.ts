// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { CodelensService, CommandsService } from "./services";
import { ContextProvider } from "./providers";

const contextProvider = ContextProvider.getInstance();
const codeLensService = CodelensService.getInstance();
const commandsService = CommandsService.getInstance();

export function activate(context: vscode.ExtensionContext) {
  contextProvider.setContext(context);

  commandsService.register();
  codeLensService.register();
}

// This method is called when your extension is deactivated
export function deactivate() {
  contextProvider.clearDisposable();
}
