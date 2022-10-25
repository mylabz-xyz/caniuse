import * as vscode from "vscode";
import { LANGAGES } from "../models/Langages";
import { REGEX } from "../models/Regex";

/**
 * CodelensProvider
 */
export class AnnotationProvider implements vscode.Disposable {
  protected _disposable?: vscode.Disposable;

  private static instance: AnnotationProvider;

  private decorations: vscode.DecorationOptions[] = [];
  private regex: RegExp = REGEX.KeyValueRegex;
  private supportedLangages = LANGAGES.SUPPORTED;
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

  private state = {
    isAnnotationsShow: { state: false, interval: null },
    isWaittingForChange: { state: false, interval: null },
  };

  constructor() {
    this._disposable = vscode.Disposable.from(
      vscode.window.onDidChangeActiveTextEditor(this.onActiveTextEditor, this),
      vscode.window.onDidChangeWindowState(this.onWindowsState, this),
      vscode.workspace.onDidChangeTextDocument(this.onWorkspaceState, this)
    );

    vscode.workspace.onDidChangeConfiguration((ctx) => {
      if (ctx.affectsConfiguration("caniuse.enableCodeLens")) {
      }
    });
  }

  private onWindowsState(e: vscode.WindowState) {
    this.onActiveTextEditor(vscode.window.activeTextEditor);
  }

  private onWorkspaceState(e: vscode.TextDocumentChangeEvent) {
    this.clearAnnotations();
  }

  private clearIntervalListeners() {
    clearInterval(this.state.isAnnotationsShow.interval as never);
    clearInterval(this.state.isWaittingForChange.interval as never);
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
      this.supportedLangages.includes(e!.document.languageId) &&
      vscode.workspace.getConfiguration().get("caniuse.enableCodeLens")
    ) {
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

  private clearAnnotations() {
    this.decorations = [];

    vscode.window.activeTextEditor?.setDecorations(
      this.annotationDecoration,
      this.decorations
    );
  }

  dispose() {
    this.clearAnnotations();
    this._disposable!.dispose();
  }
}
