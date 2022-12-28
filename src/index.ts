import { HotCLI } from "./HotCLI";

let cli: HotCLI = new HotCLI ();
cli.setup (process.argv).then (async () =>
    {
        await cli.start ();
    });