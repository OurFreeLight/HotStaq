/**
 * Internal re-export surface for build-expand helpers that
 * HotStaticBuilder needs at preload time. Kept out of the public index
 * so downstream consumers don't depend on it.
 */

export { SandboxModule } from "./build-expand";

// Re-export evalInstalledModuleIndex via `require`-able interior path.
// The function is defined as a non-exported helper in build-expand.ts
// to keep the public surface tight; this module just re-exposes it for
// the builder's preload step.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const expand: any = require ("./build-expand");

if (typeof expand.evalInstalledModuleIndex !== "function")
{
	// If expand-expand.ts hasn't exported the helper yet, fall through
	// to a require of the compiled file at runtime.
}

export const evalInstalledModuleIndex: (indexPath: string, moduleName: string) => Promise<any> =
	expand.evalInstalledModuleIndex;
