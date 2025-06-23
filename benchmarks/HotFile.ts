import { HotFile } from '../src/HotFile';
import { HotIO } from '../src/HotIO';
import { HotStaq } from '../src/HotStaq';
import { HotPage } from '../src/HotPage';

import { bench } from './utils';

// Fake data helpers ---------------------------------------------------------
async function loadHotFile(clazz: typeof HotFile, args: any) {
  const f = new clazz({ "page": args.page });
  f.content = args.content;
  return () => f.process(args);   // return *deferred* runner
}

export async function start(processor: HotStaq, page: HotPage) {
  const args = {
    processor: processor,
    page: page,
    content: await HotIO.readTextFile ("./benchmarks/TestContent.hott")
  };

  await bench(processor.logger, 'new', () => loadHotFile(HotFile, args), 1000);
}