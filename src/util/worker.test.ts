import { describe, expect, it, vi } from "vitest";
import { workerClient } from "./worker";

/** A stand-in worker: `reply` says what it does with a message. */
function fake(reply: (w: FakeWorker, msg: { id: number; req: number }) => void) {
  return () => new FakeWorker(reply) as unknown as Worker;
}
class FakeWorker {
  onmessage: ((e: { data: unknown }) => void) | null = null;
  onerror: ((e: { preventDefault: () => void }) => void) | null = null;
  onmessageerror: (() => void) | null = null;
  terminated = false;
  constructor(private reply: (w: FakeWorker, msg: { id: number; req: number }) => void) {}
  postMessage(msg: { id: number; req: number }) {
    queueMicrotask(() => this.reply(this, msg));
  }
  terminate() {
    this.terminated = true;
  }
}
const double = (n: number) => 2 * n;

describe("work off the page's thread", () => {
  it("answers through the worker", async () => {
    const ask = workerClient(fake((w, m) => w.onmessage!({ data: { id: m.id, answer: m.req * 10 } })), double, 1000);
    expect(await ask(3)).toBe(30);
  });

  it("a worker that fails to load: the work is done here, then and from then on", async () => {
    const ask = workerClient(fake((w) => w.onerror!({ preventDefault() {} })), double, 1000);
    expect(await ask(3)).toBe(6);
    expect(await ask(4)).toBe(8);
  });

  it("no workers at all: done here", async () => {
    const ask = workerClient(() => {
      throw new Error("no Worker");
    }, double, 1000);
    expect(await ask(5)).toBe(10);
  });

  it("an answer that never comes: given up (null) after the timeout, never left waiting", async () => {
    vi.useFakeTimers();
    try {
      const ask = workerClient(fake(() => {}), double, 1000);
      const answer = ask(3);
      await vi.advanceTimersByTimeAsync(1001);
      expect(await answer).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });
});
