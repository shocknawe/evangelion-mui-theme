/**
 * The generated API table — prop · type · default · description.
 *
 * Rows come straight from the component's `<Name>Props` interface, read by
 * `scripts/generate-metadata.mjs` with the TypeScript compiler API, so the table
 * cannot drift from the source.
 */
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Stamp } from '@components';
import type { PropDoc } from '../siteData';

export function PropsTable({ props }: { props: PropDoc[] }) {
  if (!props.length) {
    return (
      <Typography
        sx={(t) => ({
          fontFamily: t.nerv.fonts.mono,
          fontSize: 12,
          color: t.nerv.hue.greenMap,
          textTransform: 'none',
        })}
      >
        No public props interface — see the source for the full signature.
      </Typography>
    );
  }

  return (
    <Box sx={(t) => ({ overflowX: 'auto', border: `1px solid ${t.nerv.hue.greenDim}` })}>
      <Table size="small" sx={{ minWidth: 660 }}>
        <TableHead>
          <TableRow>
            <TableCell>PROP</TableCell>
            <TableCell>TYPE</TableCell>
            <TableCell>DEFAULT</TableCell>
            <TableCell>NOTES</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.map((p) => (
            <TableRow key={p.name}>
              <TableCell sx={{ whiteSpace: 'nowrap', verticalAlign: 'top' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Box
                    component="code"
                    sx={(t) => ({
                      fontFamily: t.nerv.fonts.mono,
                      fontSize: 12,
                      color: t.nerv.hue.mintHi,
                    })}
                  >
                    {p.name}
                  </Box>
                  {p.required && (
                    <Stamp tone="red" size="sm">
                      REQ
                    </Stamp>
                  )}
                </Box>
              </TableCell>

              <TableCell sx={{ maxWidth: 300, verticalAlign: 'top' }}>
                <Box
                  component="code"
                  sx={(t) => ({
                    fontFamily: t.nerv.fonts.mono,
                    fontSize: 11,
                    lineHeight: 1.5,
                    color: t.nerv.hue.blue,
                    textTransform: 'none',
                    wordBreak: 'break-word',
                  })}
                >
                  {p.type}
                </Box>
              </TableCell>

              <TableCell sx={{ whiteSpace: 'nowrap', verticalAlign: 'top' }}>
                {p.default ? (
                  <Box
                    component="code"
                    sx={(t) => ({ fontFamily: t.nerv.fonts.mono, fontSize: 11, color: t.nerv.hue.amber })}
                  >
                    {p.default}
                  </Box>
                ) : (
                  <Box component="span" sx={(t) => ({ color: t.nerv.hue.greenDim })}>
                    —
                  </Box>
                )}
              </TableCell>

              <TableCell
                sx={(t) => ({
                  fontSize: 11.5,
                  lineHeight: 1.55,
                  minWidth: 220,
                  verticalAlign: 'top',
                  textTransform: 'none',
                  color: t.nerv.hue.greenMap,
                })}
              >
                {p.description || '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
