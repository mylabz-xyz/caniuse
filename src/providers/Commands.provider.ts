import * as vscode from "vscode";

export class CommandsProvider {
  private static instance: CommandsProvider;

  public static getInstance(): CommandsProvider {
    if (!CommandsProvider.instance) {
      CommandsProvider.instance = new CommandsProvider();
    }
    return CommandsProvider.instance;
  }

  register(command: string, fn: (...args: any[]) => any) {
    return vscode.commands.registerCommand(command, fn);
  }
}
