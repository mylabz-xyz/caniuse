import * as vscode from "vscode";

/**
 * CodelensProvider
 */
export class CodelensProvider implements vscode.CodeLensProvider {
  private static instance: CodelensProvider;

  private _onDidChangeCodeLenses: vscode.EventEmitter<void> =
    new vscode.EventEmitter<void>();
  public onDidChangeCodeLenses: vscode.Event<void> =
    this._onDidChangeCodeLenses.event;

  private codeLenses: vscode.CodeLens[] = [];
  private regex: RegExp;
  private langagesID = ["css", "scss"];
  private feedback = {
    title: {
      ok: "✅",
      warn: "⚠️",
      issue: "❌",
      experimental: "⚗️",
    },
  };

  constructor() {
    this.regex = /([-a-zA-Z0-9 ]*:[#a-zA-Z0-9\- :]*)/g;
    vscode.workspace.onDidChangeConfiguration((ctx) => {
      if (ctx.affectsConfiguration("caniuse.enableCodeLens")) {
        this._onDidChangeCodeLenses.fire();
      }
      this._onDidChangeCodeLenses.fire();
    });
  }

  public static getInstance(): CodelensProvider {
    if (!CodelensProvider.instance) {
      CodelensProvider.instance = new CodelensProvider();
    }
    return CodelensProvider.instance;
  }

  public provideCodeLenses(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
    console.log(
      vscode.workspace.getConfiguration().get("caniuse.enableCodeLens")
    );
    if (vscode.workspace.getConfiguration().get("caniuse.enableCodeLens")) {
      this.codeLenses = [];
      const regex = new RegExp(this.regex);
      const text = document.getText();
      let matches;
      while ((matches = regex.exec(text)) !== null) {
        const line = document.lineAt(document.positionAt(matches.index).line);
        const indexOf = line.text.indexOf(matches[0]);
        const position = new vscode.Position(line.lineNumber, indexOf);
        const range = document.getWordRangeAtPosition(
          position,
          new RegExp(this.regex)
        );
        console.log(line);

        if (range) {
          this.codeLenses.push(
            new vscode.CodeLens(range, {
              title: this.feedback.title.experimental,
              tooltip: "Tooltip provided by sample extension",
              command: "codelens-sample.codelensAction",
              arguments: ["Argument 1", false],
            })
          );
        }
      }
      return this.codeLenses;
    }
    return [];
  }

  public resolveCodeLens(
    codeLens: vscode.CodeLens,
    token: vscode.CancellationToken
  ) {
    if (vscode.workspace.getConfiguration().get("caniuse.enableCodeLens")) {
      return codeLens;
    }
    return null;
  }
}
