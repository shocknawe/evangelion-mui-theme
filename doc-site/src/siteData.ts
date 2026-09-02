/**
 * Typed access to the generated site metadata.
 *
 * `src/generated/site-data.json` is written by `scripts/generate-metadata.mjs`
 * before every dev/build/typecheck, straight from `components/index.ts` and the
 * component sources — so the nav, API tables, and search index cannot drift from
 * the library.
 */
import data from './generated/site-data.json';

export interface PropDoc {
  name: string;
  type: string;
  required: boolean;
  default: string;
  description: string;
}

export interface ComponentDoc {
  name: string;
  slug: string;
  group: string;
  description: string;
  /** The `@example` snippet off the component's JSDoc, if it has one. */
  example: string;
  props: PropDoc[];
  sourcePath: string;
}

export interface NavGroup {
  title: string;
  items: ComponentDoc[];
}

export interface SearchEntry {
  type: 'component' | 'api' | 'foundation' | 'page';
  name: string;
  href: string;
  description: string;
  keywords: string[];
}

export const version: string = data.version;
export const pkgName: string = data.pkgName;
export const groups: NavGroup[] = data.groups as NavGroup[];
export const searchIndex: SearchEntry[] = data.searchIndex as SearchEntry[];

export const allComponents: ComponentDoc[] = groups.flatMap((g) => g.items);

export const findComponent = (slug: string): ComponentDoc | undefined =>
  allComponents.find((c) => c.slug === slug);

/** Hooks / helpers render nothing on their own, so they get no playground. */
export const isApi = (doc: ComponentDoc): boolean => doc.group === 'Hooks & utils';

/** The import line shown at the top of a component page. */
export const importLine = (doc: ComponentDoc): string =>
  `import { ${doc.name} } from '${pkgName}/components';`;

/** Read the quoted keys out of a generated union type string, e.g.
 *  `ClassesOf<'root' | 'header'>` → `['root', 'header']`. */
const unionKeys = (type: string | undefined): string[] =>
  type?.match(/'([^']+)'/g)?.map((s) => s.slice(1, -1)) ?? [];

/**
 * The part keys of a component's `classes` prop, parsed straight from the
 * generated `ClassesOf<'root' | '…'>` type text in site-data.json — so the
 * customization recipe on the page cannot drift from the props interface.
 * `root` is always the first key and always targets the outermost element.
 */
export const classKeys = (doc: ComponentDoc): string[] =>
  unionKeys(doc.props.find((p) => p.name === 'classes')?.type);

/** The slot keys of a component's `slots` prop (`SlotsOf<'tag'>`), same source. */
export const slotKeys = (doc: ComponentDoc): string[] =>
  unionKeys(doc.props.find((p) => p.name === 'slots')?.type);

/** Source link — the deploy workflow sets VITE_REPO_URL; falls back to the bare path. */
const repoUrl = import.meta.env.VITE_REPO_URL as string | undefined;
export const sourceHref = (c: ComponentDoc): string | undefined =>
  repoUrl ? `${repoUrl.replace(/\/$/, '')}/blob/main/${c.sourcePath}` : undefined;
