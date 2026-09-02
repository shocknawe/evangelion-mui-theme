#!/usr/bin/env node
/**
 * Maturity-scorecard delta logger — Task 8.3 of `upgrade-theme-quality-maturity`.
 *
 * The *scoring itself stays a judgment* (evidence weighting per §2/§2.1 of
 * `docs/maturity-scorecard.md` is done by a human in the release change — see
 * §8 "Per-release refresh"). This script does only the mechanical part the
 * spec's "records the score deltas" scenario asks for: it reads the category
 * table out of the refreshed scorecard, diffs it against the previous entry in
 * `docs/maturity-history.md`, and reports (or, with `--write`, records) the
 * deltas. Nothing here invents or recomputes a score.
 *
 * Zero new dependencies, deterministic output (no clock, no git in the
 * default dry-run path) — same discipline as `generate-dtcg.mjs` /
 * `generate-registry.mjs`.
 *
 * Usage:
 *   node scripts/maturity-refresh.mjs
 *       Dry run: print the delta report for the current scorecard vs the
 *       latest history entry. Exit 0 whether or not anything changed. Never
 *       writes.
 *   node scripts/maturity-refresh.mjs --write --release <vX.Y.Z> --date <YYYY-MM-DD> [--commit <sha>]
 *       Append a new entry to `docs/maturity-history.md` and add its summary
 *       row. `--release` and `--date` are required (explicit > inferred, and
 *       it keeps the output deterministic); `--commit` defaults to
 *       `git rev-parse --short HEAD` when inside a repo.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const SCORECARD_FILE = path.join(ROOT, 'docs', 'maturity-scorecard.md');
const HISTORY_FILE = path.join(ROOT, 'docs', 'maturity-history.md');
const CATEGORY_IDS = Array.from({ length: 20 }, (_, i) => {
  const n = i + 1;
  return n <= 10 ? `S${n}` : `U${n - 10}`;
});

const fail = (msg) => {
  console.error(`maturity-refresh: ${msg}`);
  process.exit(1);
};

/* ———————————————————————————— parsing ———————————————————————————— */

/**
 * Parse a score table whose rows look like either
 *   `| S1 Design Token Architecture | 3 | 30 + 35 + 10 = 75 (band L4) → G4 |`  (scorecard §5)
 *   `| S1 Design Token Architecture | 3 | 30 + 35 + 10 = 75 | +0 | — |`        (history entry)
 * Returns `{ id: { id, name, level, p, s, v, total } }`. Any row whose first
 * cell looks like a category id but is not `S<n>`/`U<n>` fails loudly, as does
 * a row whose evidence mix does not add up to its total — a fabricated number
 * must never reach the delta log (or the G3 ≥ 90 gate) unchallenged.
 * Subtotal/total rows (`**System subtotal**`, `**Combined total**`, …) do not
 * match and are skipped.
 */
function parseScoreTable(text) {
  const scores = {};
  const row =
    /^\|\s*([A-Za-z]+\d{0,2})\s+([^|]+?)\s*\|\s*(?:\*{0,2})([0-5])(?:\*{0,2})\s*\|\s*(\d{1,2}) \+ (\d{1,2}) \+ (\d{1,2}) = (\d{1,3})/;
  for (const line of text.split('\n')) {
    const m = row.exec(line);
    if (!m) continue;
    const [, id, name, level, p, s, v, total] = m;
    if (!/^[SU]\d{1,2}$/.test(id)) {
      fail(`unexpected row id "${id}" in a score table (expected S1–S10 / U1–U10): ${line.trim()}`);
    }
    const P = Number(p);
    const S = Number(s);
    const V = Number(v);
    const T = Number(total);
    if (P + S + V !== T) {
      fail(`${id}: evidence ${P} + ${S} + ${V} = ${P + S + V} but total says ${T}`);
    }
    if (scores[id]) fail(`duplicate row for ${id} in a score table`);
    scores[id] = {
      id,
      name: name.trim(),
      level: Number(level),
      p: P,
      s: S,
      v: V,
      total: T,
    };
  }
  return scores;
}

function readScorecard(text) {
  const section = text.split(/^## 5\. /m)[1];
  if (!section) fail('cannot find "## 5." in docs/maturity-scorecard.md');
  const table = section.split('\n## ')[0];
  const scores = parseScoreTable(table);
  validateCoverage(scores, 'docs/maturity-scorecard.md §5');
  return scores;
}

/** Latest entry = the last `## ` section that carries a score table. */
function readLatestHistoryEntry(text) {
  const sections = text.split(/^## /m).slice(1);
  for (let i = sections.length - 1; i >= 0; i--) {
    const scores = parseScoreTable(sections[i]);
    if (Object.keys(scores).length > 0) {
      validateCoverage(scores, 'docs/maturity-history.md (latest entry)');
      return { scores, heading: sections[i].split('\n')[0].trim() };
    }
  }
  return null;
}

function validateCoverage(scores, where) {
  const missing = CATEGORY_IDS.filter((id) => !scores[id]);
  if (missing.length) fail(`${where}: missing rows for ${missing.join(', ')}`);
  const extra = Object.keys(scores).filter((id) => !CATEGORY_IDS.includes(id));
  if (extra.length) fail(`${where}: unexpected rows for ${extra.join(', ')}`);
}

/* ———————————————————————————— reporting ———————————————————————————— */

const signed = (n) => (n > 0 ? `+${n}` : `${n}`);

function diffLabel(d) {
  if (d.level < 0 || d.total < 0) return 'REGRESSED';
  if (d.level === 0 && d.total === 0) return 'held';
  if (d.level > 0 || d.total > 0) return 'improved';
  return 're-scored'; // same level and total, different evidence mix
}

function deltaReport(current, previous, previousLabel) {
  const lines = [];
  const rows = CATEGORY_IDS.map((id) => {
    const now = current[id];
    const before = previous[id];
    const d = {
      level: now.level - before.level,
      total: now.total - before.total,
    };
    return {
      id,
      name: now.name,
      before,
      now,
      d,
      label: diffLabel(d),
    };
  });
  const sum = (k) => rows.reduce((acc, r) => acc + r[k], 0);

  lines.push(
    `Maturity scorecard delta — ${previousLabel} → current docs/maturity-scorecard.md`
  );
  lines.push('');
  lines.push(
    '| Category | Prev (level / pts) | Now (level / pts) | Δ level | Δ pts | Verdict |'
  );
  lines.push('| --- | --- | --- | ---: | ---: | --- |');
  for (const r of rows) {
    lines.push(
      `| ${r.id} ${r.name} | ${r.before.level} / ${r.before.total} | ` +
        `${r.now.level} / ${r.now.total} | ${signed(r.d.level)} | ` +
        `${signed(r.d.total)} | ${r.label} |`
    );
  }
  const sysNow = sumLevel(rows, 'S');
  const uxNow = sumLevel(rows, 'U');
  const sysPrev = sumLevelOf(Object.values(previous), 'S');
  const uxPrev = sumLevelOf(Object.values(previous), 'U');
  const totalNow = sysNow + uxNow;
  const totalPrev = sysPrev + uxPrev;
  lines.push('');
  lines.push(
    `System: ${sysPrev}/50 → ${sysNow}/50 (${signed(sysNow - sysPrev)}) · ` +
      `UX: ${uxPrev}/50 → ${uxNow}/50 (${signed(uxNow - uxPrev)}) · ` +
      `Total: ${totalPrev}/100 → ${totalNow}/100 (${signed(totalNow - totalPrev)})`
  );

  const regressed = rows.filter((r) => r.label === 'REGRESSED');
  if (regressed.length) {
    lines.push('');
    lines.push(
      `G3 (longevity) resets for: ${regressed.map((r) => r.id).join(', ')} — ` +
        'a regression breaks the consecutive-refresh streak, so those ' +
        'categories cannot reach L5 until they hold again across two refreshes.'
    );
  }
  const eligible = rows.filter(
    (r) => r.now.total >= 90 && r.label !== 'REGRESSED'
  );
  if (eligible.length) {
    lines.push('');
    lines.push(
      `G3 candidates (≥90 pts, streak intact): ${eligible
        .map((r) => `${r.id} (${r.now.total})`)
        .join(', ')}.`
    );
  }
  return { lines, rows, totals: { sysNow, uxNow, totalNow, sysPrev, uxPrev, totalPrev } };
}

const sumLevel = (rows, prefix) =>
  rows.filter((r) => r.id.startsWith(prefix)).reduce((a, r) => a + r.now.level, 0);
const sumLevelOf = (list, prefix) =>
  list.filter((r) => r.id.startsWith(prefix)).reduce((a, r) => a + r.level, 0);

/* ———————————————————————————— writing ———————————————————————————— */

function parseArgs(argv) {
  const args = { write: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--write') args.write = true;
    else if (a === '--release') args.release = argv[++i];
    else if (a === '--date') args.date = argv[++i];
    else if (a === '--commit') args.commit = argv[++i];
    else fail(`unknown argument: ${a}`);
  }
  if (args.write) {
    if (!args.release) fail('--write requires --release <version or name>');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(args.date ?? '')) {
      fail('--write requires --date YYYY-MM-DD (explicit, so the log stays deterministic)');
    }
    if (!args.commit) {
      try {
        args.commit = execFileSync('git', ['rev-parse', '--short', 'HEAD'], {
          cwd: ROOT,
          encoding: 'utf8',
        }).trim();
      } catch {
        fail('--write requires --commit (not inside a git repo)');
      }
    }
  }
  return args;
}

function historyEntryBlock({ release, date, commit, rows, totals }) {
  const out = [];
  out.push(`## ${release} (${date}, ${commit})`);
  out.push('');
  out.push(
    `Refreshed \`docs/maturity-scorecard.md\` §5 for release \`${release}\` and ` +
      'recorded the deltas below (procedure: scorecard §8).'
  );
  out.push('');
  out.push('| Category | Level | Evidence (P + S + V = total) | Δ level | Δ pts |');
  out.push('| --- | ---: | --- | ---: | ---: |');
  for (const r of rows) {
    out.push(
      `| ${r.id} ${r.name} | ${r.now.level} | ` +
        `${r.now.p} + ${r.now.s} + ${r.now.v} = ${r.now.total} | ` +
        `${signed(r.d.level)} | ${signed(r.d.total)} |`
    );
  }
  out.push('');
  out.push(
    `**Totals:** System ${totals.sysNow}/50 (${signed(totals.sysNow - totals.sysPrev)}), ` +
      `UX ${totals.uxNow}/50 (${signed(totals.uxNow - totals.uxPrev)}), ` +
      `combined **${totals.totalNow}/100** (${signed(totals.totalNow - totals.totalPrev)}).`
  );
  return out.join('\n');
}

function summaryRow({ release, date, commit, totals }) {
  const delta = signed(totals.totalNow - totals.totalPrev);
  return `| ${release} | ${date} | ${commit} | ${totals.sysNow} | ${totals.uxNow} | ${totals.totalNow} | ${delta} |`;
}

/** Insert the summary row after the last `|`-row of the "## Summary" table. */
function insertSummaryRow(text, row) {
  const lines = text.split('\n');
  const start = lines.findIndex((l) => l.trim() === '## Summary');
  if (start === -1) fail('docs/maturity-history.md has no "## Summary" table');
  let last = -1;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^## /.test(lines[i])) break;
    if (lines[i].startsWith('|')) last = i;
  }
  if (last === -1) fail('"## Summary" section has no table rows');
  lines.splice(last + 1, 0, row);
  return lines.join('\n');
}

/* ———————————————————————————— main ———————————————————————————— */

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const [scorecardText, historyText] = await Promise.all([
    readFile(SCORECARD_FILE, 'utf8'),
    readFile(HISTORY_FILE, 'utf8').catch(() => null),
  ]);
  const current = readScorecard(scorecardText);

  let previous = null;
  if (historyText) previous = readLatestHistoryEntry(historyText);

  if (!previous) {
    fail(
      'no previous entry in docs/maturity-history.md — record the baseline ' +
        'row there first (see docs/maturity-scorecard.md §8)'
    );
  }

  const { lines, rows, totals } = deltaReport(
    current,
    previous.scores,
    previous.heading
  );
  console.log(lines.join('\n'));

  if (!args.write) {
    console.log(
      '\n(dry run — nothing written; re-run with --write --release <v> --date <YYYY-MM-DD> to record)'
    );
    return;
  }

  const entry = historyEntryBlock({
    release: args.release,
    date: args.date,
    commit: args.commit,
    rows,
    totals,
  });
  let next = historyText.replace(/\n*$/, '\n\n') + entry + '\n';
  next = insertSummaryRow(next, summaryRow({ release: args.release, date: args.date, commit: args.commit, totals }));
  await writeFile(HISTORY_FILE, next);
  console.log(`\nRecorded entry "${args.release}" in docs/maturity-history.md`);
}

main().catch((e) => fail(e?.message ?? String(e)));