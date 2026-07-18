/**
 * Shape — radius 0 by default. The system is hard-cornered; chips and meter
 * segments get 2–4px, and hero panels chamfer via clip-path (see nerv.chamfer),
 * never via a large border-radius.
 */
import { radii } from './tokens';

export const shape = {
  borderRadius: radii.none,
} as const;
