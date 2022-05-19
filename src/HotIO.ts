import * as fs from "fs";
import * as fse from "fs-extra";

const util = require ("util");
import * as child_process from "child_process";
const asyncExec = util.promisify (child_process.exec);

/**
 * Handles IO for the server.
 */
export class HotIO
{
	/**
	 * Read a text file.
	 */
	static async readTextFile (path: string): Promise<string>
	{
		return (await new Promise (
			(resolve: any, reject: any): void =>
			{
				fs.readFile (path, (err: NodeJS.ErrnoException, data: Buffer): void =>
					{
						if (err != null)
							throw err;

						let content: string = data.toString ();

						resolve (content);
					});
			}));
	}

	/**
	 * Write to a text file.
	 */
	static async writeTextFile (path: string, content: string): Promise<string>
	{
		return (await new Promise (
			(resolve: any, reject: any): void =>
			{
				fs.writeFile (path, content, (err: NodeJS.ErrnoException): void =>
					{
						if (err != null)
							throw err;

						resolve ();
					});
			}));
	}

	/**
	 * Make a directory.
	 */
	static async mkdir (path: string): Promise<void>
	{
		return (await new Promise (
			(resolve: any, reject: any): void =>
			{
				fs.mkdir (path, { recursive: true }, 
					(err: NodeJS.ErrnoException, path: string) => 
					{
						if (err != null)
							throw err;

						resolve ();
					});
			}));
	}

	/**
	 * Delete a file.
	 */
	static async rm (path: string): Promise<void>
	{
		return (await new Promise (
			(resolve: any, reject: any): void =>
			{
				fs.rm (path, 
					(err: NodeJS.ErrnoException) => 
					{
						if (err != null)
							throw err;

						resolve ();
					});
			}));
	}

	/**
	 * Copy files to a location.
	 */
	static async copyFiles (src: string, dest: string): Promise<void>
	{
		return (fse.copy (src, dest));
    }

	/**
	 * Copy a file to a location.
	 */
	static async copyFile (src: string, dest: string, flags?: number): Promise<void>
	{
		return (fse.copyFile (src, dest, flags));
    }

	/**
	 * Move a file to a location.
	 */
	static async moveFile (src: string, dest: string, options: fse.MoveOptions = { overwrite: false }): Promise<void>
	{
		return (fse.move (src, dest, options));
    }

	/**
	 * Checks if a file is at a location.
	 */
	static async exists (path: string): Promise<boolean>
	{
		return (new Promise<boolean> ((resolve, reject) =>
			{
				fs.stat (path, (err: NodeJS.ErrnoException, stats: fs.Stats) =>
					{
						if (err != null)
						{
							if (err.code === "ENOENT")
								resolve (false);
							else
								throw err;
						}

						resolve (true);
					});
			}));
    }

	/**
	 * List files at a location.
	 */
	static async listFiles (path: string): Promise<string[]>
	{
		return (new Promise<string[]> ((resolve, reject) =>
			{
				fs.readdir (path, (err: NodeJS.ErrnoException, files: string[]) =>
					{
						if (err != null)
							throw err;

						resolve (files);
					});
			}));
    }

	/**
	 * Execute a command.
	 */
	static async exec (cmd: string): Promise<string>
	{
		let output = await asyncExec (cmd);

		return (output.stdout);
	}

	/**
	 * Execute a command as a grabbable process.
	 */
	static spawn (cmd: string, args: string[]): child_process.ChildProcess
	{
		let output: child_process.ChildProcess = child_process.spawn (cmd, args);

		return (output);
	}
}