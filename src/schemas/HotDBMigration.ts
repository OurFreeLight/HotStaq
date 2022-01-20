/**
 * Migration data related to table changes.
 */
export abstract class HotDBMigration
{
    /**
     * The version of this migration. **NOTE USE WHOLE INTEGERS ONLY**
     */
    version: number;

    constructor (version: number = 1)
    {
        this.version = version;
    }

    /**
     * Executes when migrating the table upwards.
     */
    abstract up (): Promise<void>;
    /**
     * Executes when migrating the table downwards, or undoing actions.
     */
    abstract down (): Promise<void>;
}