/**
 * Component override map — every category merged into one `Components<Theme>`.
 * DataGrid is intentionally excluded (opt-in; see ./dataGrid.ts).
 */
import type { Components, Theme } from '@mui/material/styles';

import { buttons } from './buttons';
import { cssBaseline } from './cssBaseline';
import { dataDisplay } from './dataDisplay';
import { feedback } from './feedback';
import { inputs } from './inputs';
import { navigation } from './navigation';
import { surfaces } from './surfaces';

export const components: Components<Theme> = {
  ...cssBaseline,
  ...buttons,
  ...inputs,
  ...surfaces,
  ...dataDisplay,
  ...navigation,
  ...feedback,
};
