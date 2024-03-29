import * as fs from "fs";
import crypto from "crypto";
import * as ppath from "path";
import * as fse from "fs-extra";
import * as yaml from "yaml";

const util = require ("util");
import * as child_process from "child_process";
const asyncExec = util.promisify (child_process.exec);

/**
 * Handles IO for the server.
 * 
 * @todo Add tests for all these functions!
 */
export class HotIO
{
	/**
	 * Read a text file.
	 */
	static async readTextFile (path: string): Promise<string>
	{
		return (new Promise (
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
	 * Write a file stream.
	 */
	static writeFileStream (path: string, stream: fs.ReadStream): fs.WriteStream
	{
		let writeStream: fs.WriteStream = fs.createWriteStream (path);
		stream.pipe (writeStream);

		return (writeStream);
	}

	/**
	 * Read a file and create a stream from it.
	 */
	static readFileStream (path: string): fs.ReadStream
	{
		let stream: fs.ReadStream = fs.createReadStream (path);

		return (stream);
	}

	/**
	 * Read a text file, parse it, and return the parsed JSON.
	 */
	static async readJSONFile (path: string): Promise<any>
	{
		const textStr: string = await HotIO.readTextFile (path);
		const jsonObj: any = JSON.parse (textStr);

		return (jsonObj);
	}

	/**
	 * Read a YAML file, parse it, and return the parsed object.
	 */
	static async readYAMLFile (path: string): Promise<any>
	{
		const textStr: string = await HotIO.readTextFile (path);
		const jsonObj: any = yaml.parse (textStr);

		return (jsonObj);
	}

	/**
	 * Get the SHA256 hash of a file.
	 */
	static async sha256File (path: string): Promise<string>
	{
		return (new Promise<string> ((resolve, reject) =>
			{
				const input: fs.ReadStream = HotIO.readFileStream (path);
				const hash: crypto.Hash = crypto.createHash ("sha256");

				input.on ("readable", () =>
					{
						const data: any = input.read ();

						if (data)
							hash.update (data);
						else
						{
							const hashStr: string = hash.digest ("hex");
							resolve (hashStr);
						}
					});

				input.on ("error", (err: NodeJS.ErrnoException) =>
					{
						reject (err);
					});
			}));
	}

	/**
	 * Write to a text file.
	 */
	static async writeTextFile (path: string, content: string): Promise<string>
	{
		return (new Promise (
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
	 * Make a directory recursively.
	 */
	static async mkdir (path: string, 
		options: fs.MakeDirectoryOptions = { "recursive": true }): Promise<void>
	{
		return (new Promise (
			(resolve: any, reject: any): void =>
			{
				fs.mkdir (path, options, 
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
	static async rm (path: string, options: fs.RmOptions = 
		{ "force": false, maxRetries: 0, recursive: false, retryDelay: 100 }): Promise<void>
	{
		return (new Promise (
			(resolve: any, reject: any): void =>
			{
				fs.rm (path, options, 
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
	static async copyFiles (src: string, dest: string, options: fse.CopyOptions = undefined): Promise<void>
	{
		return (fse.copy (src, dest, options));
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
	 * Normalize a file path.
	 */
	static normalizePath (path: string): string
	{
		return (ppath.normalize (path));
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