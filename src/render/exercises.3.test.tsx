// Every exercise's drags, split in 5 so they run in parallel (see testing/checks.ts).
import { exerciseShard } from "./testing/checks";

exerciseShard(3, 5);
