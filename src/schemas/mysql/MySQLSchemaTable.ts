import { MySQLSchemaField, MySQLSchemaFieldResult } from "./MySQLSchemaField";
import { HotDBGenerationType } from "../HotDBSchema";
import { HotDBMySQL } from "../HotDBMySQL";

/**
 * The database table.
 */
export class MySQLSchemaTable
{
	/**
	 * The name of the table.
	 */
	name: string;
	/**
	 * The table's description.
	 */
	description: string;
	/**
	 * The fields in the table.
	 */
	fields: MySQLSchemaField[];
	/**
	 * The table's engine to use.
	 */
	engine: string;
	/**
	 * The table's charset to use.
	 */
	charset: string;

	constructor (name: string = "", fields: MySQLSchemaField[] = [])
	{
		this.name = name;
		this.description = "";
		this.fields = fields;
		this.engine = "InnoDB";
		this.charset = "utf8";
	}

	/**
	 * Add a field.
	 */
	addField (field: MySQLSchemaField): void
	{
		this.fields.push (field);
	}

	/**
	 * Add a field.
	 */
	addFields (fields: MySQLSchemaField[]): void
	{
		for (let iIdx = 0; iIdx < this.fields.length; iIdx++)
		{
			let field: MySQLSchemaField = this.fields[iIdx];
			this.fields.push (field);
		}
	}

	/**
	 * Generate the db command. If type is set to modify, you must pass a db with an 
	 * active connection. Since field parsing isn't completely implemented yet, not all 
	 * fields will be modified correctly. Use modifiying with caution. This will 
	 * skip checking for:
	 * * Binary columnexistingFields
	 * * unique
	 * * zero-filled
	 * * generated column
	 */
	async generate (type: HotDBGenerationType = HotDBGenerationType.Create, db: HotDBMySQL = null): Promise<string[]>
	{
		let output: string[] = [];

		if (type === HotDBGenerationType.Create)
		{
			let primaryKeys: string[] = [];
			let keys: string[] = [];

			let result: string = `CREATE TABLE IF NOT EXISTS ${this.name} (\n`;

			// Generate the fields.
			for (let iIdx = 0; iIdx < this.fields.length; iIdx++)
			{
				let field: MySQLSchemaField = this.fields[iIdx];
				let fieldResult: MySQLSchemaFieldResult = await field.generate ();

				if (fieldResult.primaryKey !== "")
					primaryKeys.push (fieldResult.primaryKey);

				if (fieldResult.key !== "")
					keys.push (fieldResult.key);

				result += `${fieldResult.field},\n`;
			}

			// Generate the primary keys.
			if (primaryKeys.length > 0)
			{
				result += "PRIMARY KEY (";

				for (let iIdx = 0; iIdx < primaryKeys.length; iIdx++)
				{
					let primaryKey: string = primaryKeys[iIdx];

					result += `\`${primaryKey}\`,`;
				}

				result = result.substr (0, (result.length - 1));
				result += "),\n";
			}

			// Generate the keys.
			if (keys.length > 0)
			{
				for (let iIdx = 0; iIdx < keys.length; iIdx++)
				{
					let key: string = keys[iIdx];

					result += `${key},\n`;
				}
			}

			result = result.substr (0, (result.length - 2));
			result += `) ENGINE=${this.engine} DEFAULT CHARSET=${this.charset};\n\n`;

			output.push (result);
		}

		if (type === HotDBGenerationType.Modify)
		{
			if (db == null)
				throw new Error ("Cannot modify a database structure when db is null.");

			let dbresult = await db.query (`describe ${this.name};`);
			let existingFields: MySQLSchemaField[] = [];
			let existingFieldsNames: string[] = [];
			let thisFieldsNames: string[] = [];

			if (dbresult.error != null)
				throw new Error (`Error while modifying structure ${this.name}, error: ${dbresult.error}`);

			// Get this fields names.
			for (let iIdx = 0; iIdx < this.fields.length; iIdx++)
			{
				let thisField: MySQLSchemaField = this.fields[iIdx];

				thisFieldsNames.push (thisField.name);
			}

			// Get the fields.
			for (let iIdx = 0; iIdx < dbresult.results.length; iIdx++)
			{
				let jsonField = dbresult.results[iIdx];
				let dbfield: MySQLSchemaField = MySQLSchemaField.parse (jsonField);

				existingFieldsNames.push (dbfield.name);
				existingFields.push (dbfield);
			}

			let ignoreFields: string[] = [];

			// Delete any fields missing from this.fields
			for (let iIdx = 0; iIdx < existingFields.length; iIdx++)
			{
				let existingField: MySQLSchemaField = existingFields[iIdx];
				let pos: number = thisFieldsNames.indexOf (existingField.name);

				if (pos < 0)
				{
					let tempAlter: string = 
						`ALTER TABLE ${this.name} DROP COLUMN \`${existingField.name}\`;`;
					ignoreFields.push (existingField.name);
					let result: string = tempAlter;

					output.push (result);
				}
			}

			// Add any fields missing from this.fields
			for (let iIdx = 0; iIdx < this.fields.length; iIdx++)
			{
				let thisField: MySQLSchemaField = this.fields[iIdx];
				let pos: number = existingFieldsNames.indexOf (thisField.name);

				if (pos < 0)
				{
					let generatedField: MySQLSchemaFieldResult = await thisField.generate ();
					let position: string = "";

					if (iIdx === 0)
						position = "FIRST";
					else
					{
						/// @fixme I could see this causing issues with an existing field's 
						/// name being changed down below. Maybe? Maybe not.
						let prevName: string = existingFieldsNames[(iIdx - 1)];

						if (prevName == null)
						{
							// Is this correct? Since the previous name doesn't exist. Then 
							// the previous name must be the previous this.fields name? 
							// Basically the previous newly added field name?
							if (this.fields[(iIdx - 1)] != null)
								prevName = this.fields[(iIdx - 1)].name;
							else
							{
								/// @fixme Gotta fix this someday...
								debugger;
							}
						}

						position = `AFTER \`${prevName}\``;
					}

					let tempAlter: string = 
						`ALTER TABLE ${this.name} ADD COLUMN ${generatedField.field} ${position};`;
					ignoreFields.push (thisField.name);
					let result: string = tempAlter;

					output.push (result);
				}
			}

			// See if any columns have moved.
			for (let iIdx = 0; iIdx < existingFields.length; iIdx++)
			{
				let existingField: MySQLSchemaField = existingFields[iIdx];
				let pos: number = thisFieldsNames.indexOf (existingField.name);

				// This field has been added/deleted, ignore it.
				if (ignoreFields.indexOf (existingField.name) > -1)
					continue;

				if (pos > -1)
				{
					if (iIdx !== pos)
					{
						let tempAlter: string = 
							`ALTER TABLE ${this.name} CHANGE COLUMN \`${existingField.name}\` \`${existingField.name}\` `;

						let generatedField: MySQLSchemaFieldResult = await existingField.generate ();
						let position: string = "";

						if (pos === 0)
							position = "FIRST";
						else
							position = `AFTER \`${existingFields[iIdx].name}\``;

						tempAlter += `${generatedField.field} ${position};\n`;
						let result: string = tempAlter;

						output.push (result);
					}
				}
			}

			let checkKeysInFields: string[] = ["name", "dataType", "primaryKey", "notNull", 
				"unsignedDataType", "autoIncrement", "defaultValue"];

			/**
			 * Check for any differences between the two tables.
			 * Since MySQLSchemaField.parse is missing some fields, this will 
			 * skip checking for:
			 * * Binary column
			 * * unique
			 * * zero-filled
			 * * generated column
			 */
			for (let iIdx = 0; iIdx < existingFields.length; iIdx++)
			{
				let existingField: MySQLSchemaField = existingFields[iIdx];
				let existingFieldName: string = existingField.name.toLowerCase ();
				let existingFieldDataType: string = existingField.dataType.toLowerCase ();

				// This field has been added/deleted, ignore it.
				if (ignoreFields.indexOf (existingField.name) > -1)
					continue;

				if (this.fields[iIdx] != null)
				{
					let newField: MySQLSchemaField = this.fields[iIdx];
					let newFieldName: string = newField.name.toLowerCase ();
					let newFieldDataType: string = newField.dataType.toLowerCase ();

					// Check to see if both are exactly the same. If they are, skip.
					if (MySQLSchemaField.compare (existingField, newField, checkKeysInFields) === true)
						continue;

					let tempAlter: string = `ALTER TABLE ${this.name} CHANGE COLUMN \`${existingField.name}\` `;

					if (newFieldName !== existingFieldName)
						tempAlter += `\`${newField.name}\` `;
					else
						tempAlter += `\`${existingField.name}\` `;

					if (newField.autoIncrement === true)
						tempAlter += `AUTO_INCREMENT `;

					if (newFieldDataType !== existingFieldDataType)
						tempAlter += `\`${newField.dataType}\` `;
					else
						tempAlter += `\`${existingField.dataType}\` `;

					if (newField.unsignedDataType === true)
						tempAlter += `UNSIGNED `;

					if (newField.notNull === true)
						tempAlter += `NOT NULL `;
					else
						tempAlter += `NULL `;

					if (newField.defaultValue !== existingField.defaultValue)
						tempAlter += `DEFAULT ${newField.defaultValue} `;

					if (newField.primaryKey !== existingField.primaryKey)
					{
						tempAlter += `\n`;

						if (existingField.primaryKey === true)
						{
							if (newField.primaryKey === true)
							{
								// Do nothing.
							}
							else
							{
								tempAlter += `DROP PRIMARY KEY `;
							}
						}
						else
						{
							if (newField.primaryKey === true)
							{
								tempAlter += `ADD PRIMARY KEY (\`${newField.name}\`)`;
							}
							else
							{
								// Do nothing.
							}
						}
					}

					tempAlter += ';\n';
					let result: string = tempAlter;

					output.push (result);
				}
			}
		}

		return (output);
	}
}