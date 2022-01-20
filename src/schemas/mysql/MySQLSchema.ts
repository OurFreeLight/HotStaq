import { MySQLSchemaTable } from "./MySQLSchemaTable";
import { MySQLSchemaField } from "./MySQLSchemaField";
import { HotDBSchema, HotDBGenerationType } from "../HotDBSchema";
import { HotDBMySQL } from "../HotDBMySQL";

/**
 * The MySQL schema.
 */
export class MySQLSchema extends HotDBSchema
{
	/**
	 * The tables in this schema.
	 */
	tables: { [name: string]: MySQLSchemaTable };

	constructor (name: string)
	{
		super (name);

		this.tables = {};
	}

	/**
	 * Add a table to this schema.
	 */
	addTable (table: MySQLSchemaTable): void
	{
		this.tables[table.name] = table;
	}

	/**
	 * Add a field to a table.
	 */
	addFieldToTable (tableName: string, field: MySQLSchemaField)
	{
		if (this.tables[tableName] == null)
			throw new Error (`Table ${tableName} does not exist!`);

		this.tables[tableName].fields.push (field);
	}

	/**
	 * Add a field to a table.
	 */
	addFieldsToTable (tableName: string, fields: MySQLSchemaField[])
	{
		if (this.tables[tableName] == null)
			throw new Error (`Table ${tableName} does not exist!`);

		for (let iIdx = 0; iIdx < fields.length; iIdx++)
		{
			let field: MySQLSchemaField = fields[iIdx];
			this.tables[tableName].fields.push (field);
		}
	}

	/**
	 * Generate a table's structure. If type is set to modify, you must pass a db with an 
	 * active connection.
	 */
	async generateTableStructure (tableName: string, 
		type: HotDBGenerationType = HotDBGenerationType.Create, db: HotDBMySQL = null): Promise<string[]>
	{
		if (this.tables[tableName] == null)
			throw new Error (`Unable to generate table structure for ${tableName}. Table doesn't exist.`);

		let table: MySQLSchemaTable = this.tables[tableName];
		let generatedStructure: string[] = await table.generate (type, db);

		return (generatedStructure);
	}

	/**
	 * Generate the entire db structure. If type is set to modify, you must pass a db with an 
	 * active connection.
	 */
	async generateStructure (type: HotDBGenerationType = HotDBGenerationType.Create, db: HotDBMySQL = null): Promise<string[][]>
	{
		let result: string[][] = [];

		for (let key in this.tables)
		{
			let generatedStructure: string[] = await this.generateTableStructure (key, type, db);

			result.push (generatedStructure);
		}

		return (result);
	}
}