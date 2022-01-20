export enum HotDBGenerationType
{
	Create,
	Modify
}

/**
 * The parent database schema.
 */
export class HotDBSchema
{
	/**
	 * The name of this schema.
	 */
	name: string;

	constructor (name: string)
	{
		this.name = name;
	}
}