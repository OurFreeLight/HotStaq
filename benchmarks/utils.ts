import { performance } from 'node:perf_hooks';

import { HotLog } from "../src/HotLog";

// Generic benchmark runner
export async function bench(
	logger: HotLog,
	label: string,
	runnerFactory: () => Promise<() => Promise<unknown>>,
	iterations: number,
  )
{
	const run        = await runnerFactory();
	const samples: number[] = [];

	for (let i = 0; i < iterations; i++) {
		const t0 = performance.now();
		await run();                                // ← real work
		samples.push(performance.now() - t0);
	}

	const mean =
		samples.reduce((s, n) => s + n, 0) / samples.length;
	const min  = Math.min(...samples);
	const max  = Math.max(...samples);
	logger.info(
		`${label.padEnd(12)}  avg ${mean.toFixed(2)} ms   ` +
		`(min ${min.toFixed(2)} / max ${max.toFixed(2)})`,
	);
}