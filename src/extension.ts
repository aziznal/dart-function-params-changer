import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand(
        'dart-function-params-changer.helloWorld',
        () => {
            vscode.window.showInformationMessage(
                'Hello World from Dart Function Params Changer!'
            );
        }
    );

    context.subscriptions.push(disposable);
}

export function deactivate() {}
