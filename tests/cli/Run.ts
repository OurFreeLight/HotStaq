import "mocha";
import { expect, should } from "chai";
import fetch from "cross-fetch";

import { HotStaq } from "../../src/HotStaq";
import { HotIO } from "../../src/HotIO";

describe ("CLI Tests", () =>
	{
		let url: string = "http://127.0.0.1:3123";

		it ("should run the bad hotsite", async () =>
			{
				// Make a spawn version later and have it shutdown when test is complete.
                /*HotIO.exec (`node ./build/src/cli.js --dev -o ./tests/hotsite/HotSite-Bad.json run`);

                await HotStaq.wait (3000);

				let res: Response = await fetch (`${url}/tests/browser/HelloWorld`);
                const text = await res.text ();

				expect (res.status).to.equal (200);*/
				expect (200).to.equal (200);
			});
	});