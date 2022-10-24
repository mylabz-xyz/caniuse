import * as vscode from "vscode";

/**
 * CodelensProvider
 */
export class AnnotationProvider implements vscode.Disposable {
  protected _disposable?: vscode.Disposable;

  private static instance: AnnotationProvider;

  private decorations: vscode.DecorationOptions[] = [];
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

  private annotationDecoration = vscode.window.createTextEditorDecorationType({
    after: {
      margin: "0 0 0 1.5em",
      textDecoration: "none",
    },
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedOpen,
  });

  constructor() {
    this._disposable = vscode.Disposable.from(
      vscode.window.onDidChangeActiveTextEditor(this.onActiveTextEditor, this),
      vscode.window.onDidChangeWindowState(this.onWindowsState, this)
    );

    this.regex = /([-a-zA-Z0-9 ]*:[#a-zA-Z0-9\- :]*)/g;
    vscode.workspace.onDidChangeConfiguration((ctx) => {
      if (ctx.affectsConfiguration("caniuse.enableCodeLens")) {
      }
    });
  }

  private onWindowsState(e: vscode.WindowState) {
    this.onActiveTextEditor(vscode.window.activeTextEditor);
  }

  public static getInstance(): AnnotationProvider {
    if (!AnnotationProvider.instance) {
      AnnotationProvider.instance = new AnnotationProvider();
    }
    return AnnotationProvider.instance;
  }

  private onActiveTextEditor(e: vscode.TextEditor | undefined) {
    this.clearAnnotations();
    if (
      (e?.document.languageId.includes("css") ||
        e?.document.languageId.includes("scss")) &&
      vscode.workspace.getConfiguration().get("caniuse.enableCodeLens")
    ) {
      this.decorations = [];
      const regex = new RegExp(this.regex);
      const text = e!.document.getText();
      let matches;
      while ((matches = regex.exec(text)) !== null) {
        const line = e!.document.lineAt(
          e!.document.positionAt(matches.index).line
        );
        const indexOf = line.text.indexOf(matches[0]);
        const position = new vscode.Position(line.lineNumber, indexOf);
        const range = line.range;
        if (range) {
          const decoration: vscode.DecorationOptions = {
            renderOptions: {
              after: {
                backgroundColor: new vscode.ThemeColor(
                  "extension.cssrem.trailingLineBackgroundColor"
                ),
                color: new vscode.ThemeColor(
                  "extension.cssrem.trailingLineForegroundColor"
                ),
                contentText: line.text + this.feedback.title.experimental,
                fontWeight: "normal",
                fontStyle: "normal",
                textDecoration: "none",
              },
            },
            range: range,
          };

          this.decorations.push(decoration);
        }
      }

      vscode.window.activeTextEditor?.setDecorations(
        this.annotationDecoration,
        this.decorations
      );
    }
  }

  // public providerAnnotations(
  //   document: vscode.TextDocument,
  //   token: vscode.CancellationToken
  // ): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
  //   if (vscode.workspace.getConfiguration().get("caniuse.enableCodeLens")) {
  //     this.codeLenses = [];
  //     const regex = new RegExp(this.regex);
  //     const text = document.getText();
  //     let matches;
  //     while ((matches = regex.exec(text)) !== null) {
  //       const line = document.lineAt(document.positionAt(matches.index).line);
  //       const indexOf = line.text.indexOf(matches[0]);
  //       const position = new vscode.Position(line.lineNumber, indexOf);
  //       const range = document.getWordRangeAtPosition(
  //         position,
  //         new RegExp(this.regex)
  //       );
  //       if (range) {
  //         this.codeLenses.push(
  //           new vscode.CodeLens(range, {
  //             title: this.feedback.title.experimental,
  //             tooltip: "Tooltip provided by sample extension",
  //             command: "",
  //           })
  //         );
  //       }
  //     }
  //     return this.codeLenses;
  //   }
  //   return [];
  // }

  public resolveCodeLens(
    codeLens: vscode.CodeLens,
    token: vscode.CancellationToken
  ) {
    if (vscode.workspace.getConfiguration().get("caniuse.enableCodeLens")) {
      return codeLens;
    }
    return null;
  }

  private clearAnnotations() {
    vscode.window.activeTextEditor?.setDecorations(
      this.annotationDecoration,
      []
    );
  }

  dispose() {
    this.clearAnnotations();
    this._disposable!.dispose();
  }
}
