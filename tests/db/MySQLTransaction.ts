import "mocha";
import { describeDb } from "../TestEnv";
import { expect } from "chai";

import { HotDBMySQL, HotDBMySQLTransaction } from "../../src/schemas/HotDBMySQL";

/**
 * Unit tests for HotDBMySQL.transaction(). These use a fake mysql pool/connection
 * injected into HotDBMySQL, so they exercise the START TRANSACTION/COMMIT/ROLLBACK
 * control flow and the throw-on-error behavior without needing a real database.
 */
function makeConnection (failOn: string = null): any
{
	const calls: string[] = [];
	let released: boolean = false;

	return {
		calls,
		isReleased: () => released,
		// mysql connection.query supports query(sql, cb) and query(sql, values, cb)
		query: (sql: string, a: any, b: any) =>
		{
			const cb = (typeof a === "function") ? a : b;

			calls.push (sql);

			if ((failOn != null) && String (sql).includes (failOn))
			{
				cb (new Error ("fail: " + sql));

				return;
			}

			cb (null, [] as any[], [] as any[]);
		},
		release: () => { released = true; }
	};
}

function makePool (connection: any): any
{
	return ({ getConnection: (cb: any) => cb (null, connection) });
}

describeDb ("HotDBMySQL - Transactions", () =>
	{
		it ("commits and returns the callback result on success", async () =>
			{
				const conn = makeConnection ();
				const db = new HotDBMySQL (makePool (conn));

				const ret = await db.transaction (async (tx: HotDBMySQLTransaction) =>
					{
						await tx.query ("INSERT a");
						await tx.query ("INSERT b");

						return ("ok");
					});

				expect (ret).to.equal ("ok");
				expect (conn.calls).to.deep.equal (["START TRANSACTION", "INSERT a", "INSERT b", "COMMIT"]);
				expect (conn.isReleased ()).to.equal (true);
			});

		it ("rolls back and rethrows when the callback throws", async () =>
			{
				const conn = makeConnection ();
				const db = new HotDBMySQL (makePool (conn));

				let threw: Error = null;

				try
				{
					await db.transaction (async (tx: HotDBMySQLTransaction) =>
						{
							await tx.query ("INSERT a");
							throw new Error ("boom");
						});
				}
				catch (e) { threw = e; }

				expect (threw).to.not.equal (null);
				expect (threw.message).to.equal ("boom");
				expect (conn.calls).to.deep.equal (["START TRANSACTION", "INSERT a", "ROLLBACK"]);
				expect (conn.isReleased ()).to.equal (true);
			});

		it ("rolls back when a query itself fails (errors are not swallowed)", async () =>
			{
				const conn = makeConnection ("INSERT b");
				const db = new HotDBMySQL (makePool (conn));

				let threw: Error = null;

				try
				{
					await db.transaction (async (tx: HotDBMySQLTransaction) =>
						{
							await tx.query ("INSERT a");
							await tx.query ("INSERT b"); // fails
							await tx.query ("INSERT c"); // must never run
						});
				}
				catch (e) { threw = e; }

				expect (threw).to.not.equal (null);
				expect (threw.message).to.match (/fail/);
				expect (conn.calls).to.deep.equal (["START TRANSACTION", "INSERT a", "INSERT b", "ROLLBACK"]);
				expect (conn.isReleased ()).to.equal (true);
			});

		it ("HotDBMySQLTransaction.query throws on error instead of returning { error }", async () =>
			{
				const conn = makeConnection ("SELECT");
				const tx = new HotDBMySQLTransaction (conn);

				let threw: boolean = false;

				try { await tx.query ("SELECT 1"); }
				catch (e) { threw = true; }

				expect (threw).to.equal (true);
			});
	});
