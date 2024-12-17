// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import cp = require("child_process");
import path = require('path');
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "cstojs-vscode-ext" is now active!');
	
	let outPutChannel = vscode.window.createOutputChannel("CSTOJS_CLI output", "csharp");
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('cstojs-vscode-ext.convert', (e) => 
	{
		let _pathToFile = e?.fsPath as string;
			
		if (_pathToFile == null)
			_pathToFile = vscode.window.activeTextEditor?.document.uri.fsPath as string;

		if (_pathToFile == null)
		{
			vscode.window.showErrorMessage("File path is null! Save it first!");
			return;
		}
		
		let _directoryOutPut = path.dirname(_pathToFile) as string;
		
		let _terminal = vscode.window.activeTerminal;
		if(_terminal == null)
		{
			_terminal = vscode.window.createTerminal("CSTOJS Terminal");
		}
		
		let _options = vscode.workspace.getConfiguration('cstojs-vscode-ext');
		
		let _pathToCli = _options.get("pathToCSTOJS_CLI") as string;
		
		if (_pathToCli == null || _pathToCli == "")
			_pathToCli = context.asAbsolutePath(path.join('CSTOJS_CLI', "CSTOJS_CLI.dll"));
		
		_pathToCli = "dotnet " + _pathToCli + " ";
			
		let _args = ["f", _pathToFile, "-OutPutPath", _directoryOutPut, "-DisableConsoleColors", "true"];
				
		let _debug = _options.get("debug");
		if (_debug == true)
		{
			_args.push("-Debug");
			_args.push("true");
		}
		
		const _child = cp.exec(_pathToCli + _args.join(" "), (error, stdout, stderr) => {
			if (error) {
				throw error;
			}
			
			console.log(stdout);
			outPutChannel.appendLine(stdout);
			//_child.kill();
		});
		
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		//vscode.window.showInformationMessage('Hello World from CSTOJS VSCode Ext!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
