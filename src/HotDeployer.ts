import { HotLog } from "./HotLog";

export class HotDeployer
{
    /**
     * The logger.
     */
    logger: HotLog;

    constructor (logger: HotLog)
    {
        this.logger = logger;
    }

    /**
     * Deploy the HotStaq app at the given path.
     */
    async deploy (): Promise<void>
    {
    }
}