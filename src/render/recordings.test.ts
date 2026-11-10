/**
 * Drags recorded in the app's debug mode (Shift+D → "Download .json"), saved
 * in recordings/. Each is replayed frame by frame: no frame may crash, and if
 * the recording says what letting go should give (`expect.drops`), it must.
 */
import { describe, expect, it } from "vitest";
import { dragSpecToBehavior, Vec2 } from "dragology";
import { recorded } from "./drag";
import { harness, replay, type Recording } from "./testing/harness";

const files = import.meta.glob<Recording>("./recordings/*.json", { eager: true, import: "default" });
const recordings = Object.entries(files);

describe("recorded drags replay", () => {
  it("a recorded drag replays exactly (round trip through the app's recorder)", () => {
    const h = harness("ln(2) + ln(x)");
    const piece = h.find("ln(x)").id;
    const target = h.find("ln(2)").id;
    let rec: Recording | null = null;
    const anchor = Vec2(6, -12);
    const spec = h.rc(piece).interact!.drag(piece).with(recorded(h.rules, h.W, h.H, (r) => (rec = r)));
    const behavior = dragSpecToBehavior(spec, h.ctxFor(piece, anchor));
    const start = h.originOf(piece)!.add(anchor);
    const end = start.add(h.endsUpOffset(piece, target));
    const live = Array.from({ length: 21 }, (_, i) => behavior({ pointer: start.add(end.sub(start).mul(i / 20)) }).dropState);
    // Like a download: only what survives JSON.
    const saved: Recording = JSON.parse(JSON.stringify(rec!));
    expect(saved.pointers).toHaveLength(21);
    expect(saved.dropped).toBe("ln(2*x)");
    const again = replay(saved);
    expect(again.map((f) => f.drops)).toEqual(live.map((s) => h.show(s)));
  });

  it.each(recordings)("%s", (_, rec) => {
    const frames = replay(rec);
    expect(frames.length).toBe(rec.pointers.length);
    if (rec.expect) expect(frames[frames.length - 1].drops).toBe(rec.expect.drops);
  });
});
