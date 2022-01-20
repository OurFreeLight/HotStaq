import { HotStaq } from "../../HotStaq";

/**
 * The resulting data from a generated field.
 */
export interface MySQLSchemaFieldResult
{
	/**
	 * The field to be entered.
	 */
	field?: string;
	/**
	 * The primary key to be added.
	 */
	primaryKey?: string;
	/**
	 * The key to be added.
	 */
	key?: string;
	/**
	 * The constraint to be added.
	 */
	constraint?: string;
	/**
	 * The foreign key to be added.
	 */
	foreignKey?: string;
}

/**
 * The database field.
 */
export interface IMySQLSchemaField
{
	/**
	 * The name of the field.
	 */
	name: string;
	/**
	 * The data type, be sure to include the length of the 
	 * data type here as well.
	 */
	dataType: string;
	/**
	 * Set as a primary key.
	 */
	primaryKey?: boolean;
	/**
	 * Set as a not null.
	 */
	notNull?: boolean;
	/**
	 * Set as a unique index.
	 */
	uniqueIndex?: boolean;
	/**
	 * Set as a binary column.
	 */
	binaryColumn?: boolean;
	/**
	 * Set as an unsigned data type.
	 */
	unsignedDataType?: boolean;
	/**
	 * If this column is a number, fill with zeroes.
	 */
	fillZeroes?: boolean;
	/**
	 * Set as an auto incrementing column.
	 */
	autoIncrement?: boolean;
	/**
	 * Set as a generated column.
	 */
	generatedColumn?: boolean;
	/**
	 * Set the default value. If this is set to null, a 
	 * MySQL NULL value will be used.
	 */
	defaultValue?: string;
	/**
	 * Set the string to be used when setting the default 
	 * value. The default is: '
	 */
	strAroundDefaultValue?: string;
}

/**
 * The database field.
 */
export class MySQLSchemaField implements IMySQLSchemaField
{
	/**
	 * The name of the field.
	 */
	name: string;
	/**
	 * The data type, be sure to include the length of the 
	 * data type here as well.
	 */
	dataType: string;
	/**
	 * Set as a primary key.
	 */
	primaryKey: boolean;
	/**
	 * Set as a not null.
	 */
	notNull: boolean;
	/**
	 * Set as a unique index.
	 */
	uniqueIndex: boolean;
	/**
	 * Set as a binary column.
	 */
	binaryColumn: boolean;
	/**
	 * Set as an unsigned data type.
	 */
	unsignedDataType: boolean;
	/**
	 * If this column is a number, fill with zeroes.
	 */
	fillZeroes: boolean;
	/**
	 * Set as an auto incrementing column.
	 */
	autoIncrement: boolean;
	/**
	 * Set as a generated column.
	 */
	generatedColumn: boolean;
	/**
	 * Set the default value. If this is set to null, a 
	 * MySQL NULL value will be used.
	 */
	defaultValue: string;
	/**
	 * Set the string to be used when setting the default 
	 * value. The default is: '
	 */
	strAroundDefaultValue: string;

	constructor (name: string | IMySQLSchemaField, dataType: string = "", defaultValue: string = "", 
		primaryKey: boolean = false, notNull: boolean = true, uniqueIndex: boolean = false, 
		binaryColumn: boolean = false, unsignedDataType: boolean = false, 
		fillZeroes: boolean = false, autoIncrement: boolean = false, 
		generatedColumn: boolean = false, strAroundDefaultValue: string = "'")
	{
		if (typeof (name) === "string")
		{
			this.name = name;
			this.dataType = dataType;
			this.primaryKey = primaryKey;
			this.notNull = notNull;
			this.uniqueIndex = uniqueIndex;
			this.binaryColumn = binaryColumn;
			this.unsignedDataType = unsignedDataType;
			this.fillZeroes = fillZeroes;
			this.autoIncrement = autoIncrement;
			this.generatedColumn = generatedColumn;
			this.defaultValue = defaultValue;
			this.strAroundDefaultValue = strAroundDefaultValue;
		}
		else
		{
			this.name = name.name;
			this.dataType = name.dataType;
			this.primaryKey = name.primaryKey != null ? name.primaryKey :  primaryKey;
			this.notNull = name.notNull != null ? name.notNull : notNull;
			this.uniqueIndex = name.uniqueIndex != null ? name.uniqueIndex : uniqueIndex;
			this.binaryColumn = name.binaryColumn != null ? name.binaryColumn : binaryColumn;
			this.unsignedDataType = name.unsignedDataType != null ? name.unsignedDataType : unsignedDataType;
			this.fillZeroes = name.fillZeroes != null ? name.fillZeroes : fillZeroes;
			this.autoIncrement = name.autoIncrement != null ? name.autoIncrement : autoIncrement;
			this.generatedColumn = name.generatedColumn != null ? name.generatedColumn : generatedColumn;
			this.defaultValue = name.defaultValue === undefined ? defaultValue : name.defaultValue;
			this.strAroundDefaultValue = 
				name.strAroundDefaultValue === undefined ? strAroundDefaultValue : name.strAroundDefaultValue;
		}

		if (this.dataType == null)
			throw new Error (`No data type given for field ${this.name}`)
	}

	/**
	 * Compare two different fields. This will iterate through all keys in each field. Any 
	 * string values found will have stringFilter applied to it, removing everything that 
	 * is in that stringFilter regex. Additionally for any empty strings found it will 
	 * compare to any undefined/null on the other side, and treat them as the same.
	 * 
	 * @param field1 The first field to compare.
	 * @param field2 The second field to compare.
	 * @param onlyKeys Only compare using the provided keys. If set to null, this will compare 
	 * using all of the keys in these objects.
	 * @param stringFilter The regex to be used to help make any filters on any detected 
	 * strings. The default regex provided will remove any whitespaces, single/doube quotes, 
	 * back ticks, and parenthesis. If this is set to null, it will not be used.
	 */
	static compare (field1: MySQLSchemaField, field2: MySQLSchemaField, onlyKeys: string[] = null, 
		stringFilter: RegExp = new RegExp ("(\\s+|\\'+|\\\"+|\\`+|\\(+|\\)+)", "g")): boolean
	{
		if (onlyKeys == null)
		{
			onlyKeys = ["name", "dataType", "primaryKey", "notNull", 
				"uniqueIndex", "binaryColumn", "unsignedDataType", 
				"fillZeroes", "autoIncrement", "generatedColumn", 
				"defaultValue"];
		}

		// Go through each key in both fields and compare the values.
		for (let iIdx = 0; iIdx < onlyKeys.length; iIdx++)
		{
			let key: string = onlyKeys[iIdx];
			// @ts-ignore
			let field1Value = field1[key];
			// @ts-ignore
			let field2Value = field2[key];

			if (stringFilter != null)
			{
				// If the key is a string, make them lowercase, remove any 
				// spaces and compare.
				if (typeof (field1Value) === "string")
				{
					if ((field1Value != null) && (field2Value != null))
					{
						field1Value = field1Value.toLowerCase ();
						field2Value = field2Value.toLowerCase ();
						field1Value = field1Value.replace (stringFilter, "");
						field2Value = field2Value.replace (stringFilter, "");
					}

					// Make exceptions here for when field1Value or field2Value is null
					if (field1Value == "")
					{
						if (field2Value == null)
							continue;
					}

					if (field2Value == "")
					{
						if (field1Value == null)
							continue;
					}
				}
			}

			if (field1Value !== field2Value)
				return (false);
		}

		return (true);
	}

	/**
	 * Parse a JSON object and get a MySQLSchemaField object from it.
	 * Warning! This is only partially implemented. This will not check 
	 * the following fields:
	 * * Binary column
	 * * unique
	 * * zero-filled
	 * * generated column
	 */
	static parse (json: any): MySQLSchemaField
	{
		let result: MySQLSchemaField = new MySQLSchemaField ("");

		if (json["name"] != null)
			result.name = json["name"];

		if (json["Name"] != null)
			result.name = json["Name"];

		if (json["field"] != null)
			result.name = json["field"];

		if (json["Field"] != null)
			result.name = json["Field"];

		if (json["Type"] != null)
		{
			result.dataType = json["Type"];
			const pos: number = result.dataType.indexOf ("unsigned");

			if (pos > -1)
			{
				result.dataType = result.dataType.substr (0, (pos - 1));
				result.unsignedDataType = true;
			}
		}

		if (json["Null"] != null)
			result.notNull = !HotStaq.parseBoolean (json["Null"]);

		if (json["Key"] != null)
		{
			let keyType: string = json["Key"];

			keyType = keyType.toLowerCase ();

			if (keyType === "pri")
				result.primaryKey = true;
		}

		if (json["Extra"] != null)
		{
			let extraValue: string = json["Extra"];

			extraValue = extraValue.toLowerCase ();

			if (extraValue === "auto_increment")
				result.autoIncrement = true;
		}

		if (json["Default"] != null)
			result.defaultValue = json["Default"];

		return (result);
	}

	/**
	 * Generate the db command.
	 */
	async generate (): Promise<MySQLSchemaFieldResult>
	{
		let result: MySQLSchemaFieldResult = {
				"field": "",
				"constraint": "",
				"foreignKey": "",
				"primaryKey": "",
				"key": ""
			};

		let additionalStr: string = "";
		let defaultValue: string = this.defaultValue;
		const lowerDataType: string = this.dataType.toLowerCase ();
		let strAroundDefaultValue: string = this.strAroundDefaultValue;

		if ((lowerDataType.indexOf ("int") > 0) || 
			(lowerDataType.indexOf ("float") > 0) || 
			(lowerDataType.indexOf ("decimal") > 0))
		{
			strAroundDefaultValue = "";
		}

		if ((lowerDataType.indexOf ("date") > 0) || 
			(lowerDataType.indexOf ("time") > 0) || 
			(lowerDataType.indexOf ("year") > 0))
		{
			strAroundDefaultValue = "";
		}

		if (this.unsignedDataType === true)
			additionalStr += "unsigned ";

		if (this.notNull === true)
		{
			additionalStr += "NOT NULL ";

			if (defaultValue === null)
				throw new Error (`Field ${this.name} cannot have a default value of null when notNull is set to true.`);

			if (defaultValue !== "")
				defaultValue = `${strAroundDefaultValue}${defaultValue}${strAroundDefaultValue}`;
		}
		else
		{
			additionalStr += "NULL ";

			if (defaultValue === null)
				defaultValue = "NULL";
			else
				defaultValue = `${strAroundDefaultValue}${defaultValue}${strAroundDefaultValue}`;
		}

		if (this.autoIncrement === true)
			additionalStr += "AUTO_INCREMENT ";

		if (defaultValue === "")
		{
			if ((lowerDataType.indexOf ("int") > 0) || 
				(lowerDataType.indexOf ("float") > 0) || 
				(lowerDataType.indexOf ("decimal") > 0))
			{
				defaultValue = `0`;
			}
			else
				defaultValue = `${strAroundDefaultValue}${strAroundDefaultValue}`;
		}

		let defaultValueStr: string = "";

		if (this.autoIncrement === false)
			defaultValueStr = ` DEFAULT ${defaultValue}`;

		result.field = `\`${this.name}\` ${this.dataType} ${additionalStr}${defaultValueStr}`;

		if (this.primaryKey === true)
			result.primaryKey = `${this.name}`;

		if (this.uniqueIndex === true)
			result.key = `UNIQUE KEY \`${this.name}_UNIQUE\` (\`${this.name}\`)`;

		return (result);
	}
}