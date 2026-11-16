/**
 * Show's way on, searched off the main thread (see showWay.ts): a long board
 * takes a second or so to search, and the page must keep playing the move
 * being shown meanwhile.
 */
import { wayFor, type WayAnswer, type WayRequest } from "./showWay";

self.onmessage = (e: MessageEvent<WayRequest>) => {
  self.postMessage({ id: e.data.id, way: wayFor(e.data) } satisfies WayAnswer);
};
