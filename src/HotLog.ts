/**
 * The logging level.
 */
export enum HotLogLevel
{
	/**
	 * Prints only info messages.
	 */
	Info,
	/**
	 * Prints only warning messages.
	 */
	Warning,
	/**
	 * Prints only error messages.
	 */
	Error,
	/**
	 * Prints all messages.
	 */
	Verbose,
	/**
	 * Prints all messages, except verbose.
	 */
	All,
	/**
	 * Doesn't print any message.
	 */
	None
}

/**
 * The logger.
 */
export class HotLog
{
	/**
	 * The logging level.
	 */
	logLevel: HotLogLevel;

	constructor (logLevel: HotLogLevel = HotLogLevel.All)
	{
		this.logLevel = logLevel;
	}

	/**
	 * Log a message.
	 */
	log (level: HotLogLevel, message: string)
	{
		if (this.logLevel === HotLogLevel.Verbose)
		{
			if (level === HotLogLevel.Error)
				this.error (message);

			if (level === HotLogLevel.Warning)
				this.warning (message);

			if ((level === HotLogLevel.Info) || 
				(level === HotLogLevel.Verbose))
			{
				this.info (message);
			}
		}

		if (this.logLevel === HotLogLevel.All)
		{
			if (level === HotLogLevel.Error)
				this.error (message);

			if (level === HotLogLevel.Warning)
				this.warning (message);

			if (level === HotLogLevel.Info)
				this.info (message);
		}

		if (this.logLevel === HotLogLevel.Error)
		{
			if (level === HotLogLevel.Error)
				this.error (message);
		}

		if (this.logLevel === HotLogLevel.Warning)
		{
			if (level === HotLogLevel.Warning)
				this.warning (message);
		}

		if (this.logLevel === HotLogLevel.Info)
		{
			if (level === HotLogLevel.Info)
				this.info (message);
		}
	}

	/**
	 * Log a verbose message.
	 */
	verbose (message: string)
	{
		if (this.logLevel === HotLogLevel.Verbose)
			console.info (message);
	}

	/**
	 * Log a message.
	 */
	info (message: string)
	{
		if ((this.logLevel === HotLogLevel.All) || 
			(this.logLevel === HotLogLevel.Verbose) || 
			(this.logLevel === HotLogLevel.Info))
		{
			console.info (message);
		}
	}

	/**
	 * Log a warning.
	 */
	warning (message: string)
	{
		if ((this.logLevel === HotLogLevel.All) || 
			(this.logLevel === HotLogLevel.Verbose) || 
			(this.logLevel === HotLogLevel.Warning))
		{
			console.warn (message);
		}
	}

	/**
	 * Log an error message.
	 */
	error (message: string | Error)
	{
		if ((this.logLevel === HotLogLevel.All) || 
			(this.logLevel === HotLogLevel.Verbose) || 
			(this.logLevel === HotLogLevel.Error))
		{
			let msg: string = "";

			if (typeof (message) === "string")
				msg = message;
			else
			{
				if (message.message != null)
					msg = message.message;

				if (message.stack != null)
					msg = message.stack;
			}

			console.error (msg);
		}
	}
}