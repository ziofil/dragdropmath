/**
 * Work done off the page's thread, in a worker, that never leaves the page
 * waiting forever: if the worker can't be made, fails to load (a tab left
 * open across a deploy asks for a file that's gone) or throws, the work is
 * done here instead; if an answer takes too long, it comes back null.
 *
 * The worker's side is `serve` (in the worker's own module); the page's is
 * `workerClient`.
 */

type Ask<Req> = { id: number; req: Req };
type Answer<Ans> = { id: number; answer: Ans };

/** In a worker: answer every request with `fn` (anywhere else, as when its module is imported for `here`, nothing). */
export function serve<Req, Ans>(fn: (req: Req) => Ans): void {
  const scope = (globalThis as { WorkerGlobalScope?: new () => unknown }).WorkerGlobalScope;
  if (!scope || !(self instanceof scope)) return;
  self.onmessage = (e: MessageEvent<Ask<Req>>) => {
    self.postMessage({ id: e.data.id, answer: fn(e.data.req) } satisfies Answer<Ans>);
  };
}

/**
 * A function that asks the worker `make` makes (made on the first ask, kept
 * for the next), or does it with `here` when there's no working worker.
 * `timeout`: how long an answer may take before it's given up (null).
 */
export function workerClient<Req, Ans>(make: () => Worker, here: (req: Req) => Ans, timeout: number): ((req: Req) => Promise<Ans | null>) & { stop: () => void } {
  let worker: Worker | null | undefined;
  const waiting = new Map<number, { req: Req; done: (a: Ans | null) => void }>();
  let asked = 0;

  /** The worker is no use: what it was asked is done here, and so is everything from now on. */
  const broken = () => {
    worker?.terminate();
    worker = null;
    const left = [...waiting.values()];
    waiting.clear();
    for (const w of left) {
      try {
        w.done(here(w.req));
      } catch {
        w.done(null);
      }
    }
  };

  const ask = (req: Req): Promise<Ans | null> => {
    if (worker === undefined) {
      try {
        worker = make();
        worker.onmessage = (e: MessageEvent<Answer<Ans>>) => {
          waiting.get(e.data.id)?.done(e.data.answer);
          waiting.delete(e.data.id);
        };
        worker.onerror = (e) => {
          e.preventDefault();
          broken();
        };
        worker.onmessageerror = broken;
      } catch {
        worker = null;
      }
    }
    if (!worker) {
      try {
        return Promise.resolve(here(req));
      } catch {
        return Promise.resolve(null);
      }
    }
    const id = asked++;
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        waiting.delete(id);
        resolve(null);
      }, timeout);
      waiting.set(id, {
        req,
        done: (a) => {
          clearTimeout(timer);
          resolve(a);
        },
      });
      worker!.postMessage({ id, req } satisfies Ask<Req>);
    });
  };
  /** Ends the worker (what it was asked comes back null); the next ask makes a new one. */
  const stop = () => {
    worker?.terminate();
    worker = undefined;
    for (const w of waiting.values()) w.done(null);
    waiting.clear();
  };
  return Object.assign(ask, { stop });
}
