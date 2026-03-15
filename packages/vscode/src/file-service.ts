import * as vscode from 'vscode';
import * as path from 'path';

export interface FileContext {
  fileName: string;
  filePath: string;
  languageId: string;
  lineCount: number;
  content: string;
  selection?: string;
}

export class FileService {
  getActiveFileContext(): FileContext | null {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return null; }

    const doc = editor.document;
    const selection = editor.selection;
    const selectedText = !selection.isEmpty ? doc.getText(selection) : undefined;

    return {
      fileName: path.basename(doc.fileName),
      filePath: doc.fileName,
      languageId: doc.languageId,
      lineCount: doc.lineCount,
      content: doc.getText(),
      selection: selectedText,
    };
  }

  async insertAtCursor(text: string): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    await editor.edit(b => b.insert(editor.selection.active, text));
  }

  async replaceSelection(text: string): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.selection.isEmpty) { return; }
    await editor.edit(b => b.replace(editor.selection, text));
  }

  async createFile(relativePath: string, content: string): Promise<void> {
    const ws = vscode.workspace.workspaceFolders?.[0];
    if (!ws) { return; }
    const uri = vscode.Uri.joinPath(ws.uri, relativePath);
    await vscode.workspace.fs.writeFile(uri, Buffer.from(content, 'utf-8'));
    const doc = await vscode.workspace.openTextDocument(uri);
    await vscode.window.showTextDocument(doc);
  }

  async readFile(relativePath: string): Promise<string> {
    const ws = vscode.workspace.workspaceFolders?.[0];
    if (!ws) { return ''; }
    const uri = vscode.Uri.joinPath(ws.uri, relativePath);
    const data = await vscode.workspace.fs.readFile(uri);
    return Buffer.from(data).toString('utf-8');
  }
}
