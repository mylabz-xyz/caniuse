import * as vscode from "vscode";

export class ContextProvider {
  private static instance: ContextProvider;
  private context!: vscode.ExtensionContext;

  private disposables: vscode.Disposable[] = [];

  public static getInstance(): ContextProvider {
    if (!ContextProvider.instance) {
      ContextProvider.instance = new ContextProvider();
    }

    return ContextProvider.instance;
  }
  public setContext(context: vscode.ExtensionContext) {
    this.context = context;
  }

  public setDisposable(disposable: vscode.Disposable) {
    this.disposables.push(disposable);
  }

  public clearDisposable() {
    this.disposables.forEach((disposable: vscode.Disposable) =>
      disposable.dispose()
    );
  }
}
