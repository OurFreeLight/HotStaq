/**
 * Just another interface.
 */
export interface OtherInterface
{
	/**
	 * Another test string.
     * Yet, with another line too.
	 */
	anotherString: string;
}

/**
 * A test interface.
 */
export interface TestInterface
{
	/**
	 * A test string.
     * With another line too.
	 */
	testString: string;
	/// A test number.
	testNumber: number;
	// A test boolean.
	testBoolean: boolean;
	/* A test date. */
	testDate: Date;
	/**
	 * A test object
	 */
	testObject: {
			/**
			 * With another test string.
			 */
			testString2: string;
		};
	// Another interface object. - Will implement this later...
	testAnother: OtherInterface;
}