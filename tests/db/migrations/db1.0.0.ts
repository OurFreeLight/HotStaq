import { HotDBMigration } from "../../../src/schemas/HotDBMigration"

class Migration extends HotDBMigration
{
    constructor (version: number)
    {
        super (1);
    }

    /**
     * Executes when migrating the table upwards.
     */
    async up (): Promise<void>
    {
    }

    /**
     * Executes when migrating the table downwards, or undoing actions.
     */
    async down (): Promise<void>
    {
    }
}