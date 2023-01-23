/**
 * The test stop that is executed as either a destination or 
 * a path.
 */
export interface HotTestStop
{
	/**
	 * A command to execute. Can be:
	 * * print(x)
	 *   * Print a message to the server's console.
	 * * println(x)
	 *   * Print a message with a new line to the server's console.
	 * * url(x)
	 *   * Open a url. Must be an absolute url.
	 * * waitForTesterAPIData
	 *   * This will wait for the tester API to receive data.
	 * * wait(x)
	 *   * This will wait for x number of milliseconds.
	 * * waitForTestObject(x)
	 *   * This will wait for a test object to be loaded.
	 */
	cmd: string;
	/**
	 * The destination to execute.
	 */
	dest: string;
	/**
	 * The path to execute.
	 */
	path: string;
}