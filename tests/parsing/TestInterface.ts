/**
 * The base interface.
 */
export interface IBaseInterface
{
	/**
	 * The base string.
	 */
	baseString?: string;
}

/**
 * Yep, still another interface.
 */
export interface OtherInterfaceAgain
{
	/**
	 * Another test number.
	 * @valid { "min": 1, "max": 10 }
	 */
	anotherNum: number;
}

/**
 * Just another interface.
 */
export interface OtherInterface
{
	/**
	 * Another test string.
     * Yet, with another line too.
	 * @valid { "min": 2, "max": 10 }
	 */
	anotherString: string;
	/**
	 * Another string or object to validate.
	 * @valid Text
	 * @valid OtherInterfaceAgain
	 */
	anotherStringObject: string | OtherInterfaceAgain;
}

/**
 * A test interface.
 */
export interface TestInterface extends IBaseInterface
{
	/**
	 * A test string.
     * With another line too.
	 */
	readonly testString: string;
	/// A test number.
	testNumber: number[];
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
	/**
	 * Test validations
	 */
	testValidations: {
			/**
			 * A test string.
			 * @valid { "minLength": 5, "maxLength": 10 }
			 */
			validStr: string;
			/**
			 * A test number.
			 * @valid { "greaterThan": 5, "lessThan": 10 }
			 */
			validNum: number;
			/**
			 * A test enum.
			 * @valid { "values": ["hi", "hello"] }
			 */
			validEnum: string;
		};
}