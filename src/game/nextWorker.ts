/**
 * Practice's Next step, searched off the main thread (see showWay.ts,
 * nextStep): a long exercise can take a second to search from where its
 * board is, and the page must stay responsive.
 */
import { nextStep } from "./showWay";
import { serve } from "../util/worker";

serve(nextStep);
