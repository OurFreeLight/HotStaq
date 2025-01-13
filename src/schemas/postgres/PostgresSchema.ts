import { HotDBSchema } from "../HotDBSchema";

/**
 * The Postgres schema.
 */
export class PostgresSchema extends HotDBSchema
{
	constructor (name: string)
	{
		super (name);
	}
}