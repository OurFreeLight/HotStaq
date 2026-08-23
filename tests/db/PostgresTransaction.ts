import "mocha";
import { expect } from "chai";

import { HotDBPostgres, HotDBTransaction } from "../../src/schemas/HotDBPostgres";

/**
 * Unit tests for HotDBPostgres.transaction(). These use a fake pg.Pool/client
 * injected into HotDBPostgres, so they exercise the BEGIN/COMMIT/ROLLBACK
 * control flow and the throw-on-error behavior without needing a real database.
 */
function makeFakeClient (failOn: string = null): any
{
	const calls: string[] = [];
	let released: boolean = false;

	return {
		calls,
		isReleased: () => released,
		query: async (text: string) =>
		{
			calls.push (text);

			if ((failOn != null) && String (text).includes (failOn))
				throw new Error ("simulated failure on: " + text);

			return ({ rows: [] as any[], fields: [] as any[] });
		},
		release: () => { released = true; }
	};
}

function makePool (client: any): any
{
	return ({ connect: async () => client });
}

describe ("HotDBPostgres - Transactions", () =>
	{
		it ("commits and returns the callback result on success", async () =>
			{
				const client = makeFakeClient ();
				const db = new HotDBPostgres (makePool (client));

				const ret = await db.transaction (async (tx: HotDBTransaction) =>
					{
						await tx.query ("INSERT INTO a VALUES (1)");
						await tx.query ("INSERT INTO b VALUES (2)");

						return ("ok");
					});

				expect (ret).to.equal ("ok");
				expect (client.calls).to.deep.equal (
					["BEGIN", "INSERT INTO a VALUES (1)", "INSERT INTO b VALUES (2)", "COMMIT"]);
				expect (client.isReleased ()).to.equal (true);
			});

		it ("rolls back and rethrows when the callback throws", async () =>
			{
				const client = makeFakeClient ();
				const db = new HotDBPostgres (makePool (client));

				let threw: Error = null;

				try
				{
					await db.transaction (async (tx: HotDBTransaction) =>
						{
							await tx.query ("INSERT INTO a VALUES (1)");
							throw new Error ("boom");
						});
				}
				catch (e) { threw = e; }

				expect (threw).to.not.equal (null);
				expect (threw.message).to.equal ("boom");
				expect (client.calls).to.deep.equal (
					["BEGIN", "INSERT INTO a VALUES (1)", "ROLLBACK"]);
				expect (client.isReleased ()).to.equal (true);
			});

		it ("rolls back when a query itself fails (errors are not swallowed)", async () =>
			{
				const client = makeFakeClient ("INSERT INTO b");
				const db = new HotDBPostgres (makePool (client));

				let threw: Error = null;

				try
				{
					await db.transaction (async (tx: HotDBTransaction) =>
						{
							await tx.query ("INSERT INTO a VALUES (1)");
							await tx.query ("INSERT INTO b VALUES (2)"); // fails
							await tx.query ("INSERT INTO c VALUES (3)"); // must never run
						});
				}
				catch (e) { threw = e; }

				expect (threw).to.not.equal (null);
				expect (threw.message).to.match (/simulated failure/);
				expect (client.calls).to.deep.equal (
					["BEGIN", "INSERT INTO a VALUES (1)", "INSERT INTO b VALUES (2)", "ROLLBACK"]);
				expect (client.isReleased ()).to.equal (true);
			});

		it ("HotDBTransaction.query throws on error instead of returning { error }", async () =>
			{
				const client = makeFakeClient ("SELECT");
				const tx = new HotDBTransaction (client);

				let threw: boolean = false;

				try { await tx.query ("SELECT 1"); }
				catch (e) { threw = true; }

				expect (threw).to.equal (true);
			});

		it ("preserves falsy return values and commits an empty transaction", async () =>
			{
				const client = makeFakeClient ();
				const db = new HotDBPostgres (makePool (client));

				const ret = await db.transaction (async () => 0);

				expect (ret).to.equal (0);
				expect (client.calls).to.deep.equal (["BEGIN", "COMMIT"]);
			});
	});
