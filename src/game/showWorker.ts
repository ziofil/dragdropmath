/**
 * Show's way on, searched off the main thread (see showWay.ts): a long board
 * takes a second or so to search, and the page must keep playing the move
 * being shown meanwhile.
 */
import { wayFor } from "./showWay";
import { serve } from "../util/worker";

serve(wayFor);
