import { HotCLI } from "hotstaq";

let cli: HotCLI = new HotCLI ();
cli.setup (process.argv).then (async () =>
    {
        await cli.start ();
    });