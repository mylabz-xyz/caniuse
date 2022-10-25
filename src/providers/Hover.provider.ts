import * as vscode from "vscode";
import { LANGAGES } from "../models/Langages";
import { REGEX } from "../models/Regex";

export class HoverProvider implements vscode.HoverProvider {
  private regex: RegExp = REGEX.KeyValueRegex;
  private supportedLangages = LANGAGES.SUPPORTED;

  constructor() {
    vscode.languages.registerHoverProvider("css", this);
    vscode.languages.registerHoverProvider("scss", this);
  }

  public provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.Hover | undefined {
    const line = document.lineAt(position.line);
    const { text, range } = line;
    console.log(text);

    const markdown = new vscode.MarkdownString(
      `<img src="https://caniuse.bitsofco.de/static/v1/mdn-css__properties__flex-1666667559225.jpg" alt="drawing" style="width:100%;"/>`,
      true
    );

    markdown.supportHtml = true;
    markdown.isTrusted = true;

    return new vscode.Hover(markdown, line.range);
  }
}
