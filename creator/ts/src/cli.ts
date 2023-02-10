import { HotCLI } from "hotstaq";

let cli: HotCLI = new HotCLI ();
cli.setup ().then (async () =>
    {
        await cli.start (process.argv);
    });