// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { CodelensProvider } from "./providers";

let disposables: vscode.Disposable[] = [];

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const codelensProvider = new CodelensProvider();

  vscode.languages.registerCodeLensProvider("*", codelensProvider);
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "caniuse" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let helloWorld = vscode.commands.registerCommand(
    "caniuse.hellddddoWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage("Hello World from caniuse!");
    }
  );

  let enableCodeLens = vscode.commands.registerCommand(
    "caniuse.enableCodeLens",
    () => {
      vscode.workspace
        .getConfiguration("caniuse")
        .update("enableCodeLens", true, true);
    }
  );

  let disableCodeLens = vscode.commands.registerCommand(
    "caniuse.disableCodeLens",
    () => {
      vscode.workspace
        .getConfiguration("caniuse")
        .update("enableCodeLens", false, true);
    }
  );

  context.subscriptions.push(helloWorld);
  context.subscriptions.push(enableCodeLens);
  context.subscriptions.push(disableCodeLens);
}

// This method is called when your extension is deactivated
export function deactivate() {
  if (disposables) {
    disposables.forEach((item) => item.dispose());
  }
  disposables = [];
}
