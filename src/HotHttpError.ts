/**
 * A HTTP error.
 */
export class HttpError extends Error
{
	/**
	 * The status code.
	 */
	statusCode: number;

	constructor (message: string, statusCode: number = 400)
	{
		super (message);

		this.name = "HttpError";
		this.statusCode = statusCode;
	}
}