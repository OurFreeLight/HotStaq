import { HotDBSchema } from "../HotDBSchema";

/**
 * The Influx schema.
 */
export class InfluxSchema extends HotDBSchema
{
	/**
	 * The buckets in this schema.
	 */
	buckets: { [name: string]: any };

	constructor (name: string)
	{
		super (name);

		this.buckets = {};
	}
}