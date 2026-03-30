# Comment Headers

Every source file in SumTeX must have a comment header. The format depends on the file type. All headers include at minimum `@type` and `@path`.

## Metadata Fields

| Field | Required | Description |
|-------|----------|-------------|
| `@type` | Yes | File type: `component`, `layout`, `page`, `utils`, `styles`, `data`, `config` |
| `@path` | Yes | Exact file path from project root |
| `@date` | No | Date file was created (YYYY-MM-DD) |
| `@updated` | No | Date file was last modified (YYYY-MM-DD) |

## Components (`*.tsx` in `components/`)

```tsx
/*
+------------------+----------------------------------------------------------+
| FILE             | {filename}.tsx                                           |
| ROLE             | {role description}                                       |
| OWNER            | Kris Yotam                                               |
| CREATED          | {YYYY-MM-DD}                                             |
| UPDATED          | {YYYY-MM-DD}                                             |
+------------------+----------------------------------------------------------+
| @type component                                                             |
| @path {path-to-file}                                                        |
+------------------+----------------------------------------------------------+
| SUMMARY                                                                     |
| {2-5 lines summary}                                                         |
+-----------------------------------------------------------------------------+
*/
```

## Layouts / Pages

```tsx
/* ============================================================================
 * {FILE} — {DESC}
 * @type layout | page
 * @path {path-to-file}
 *
 * {brief purpose}
 * ========================================================================== */
```

## Data Files (`*.ts` in `data/`)

```ts
/* ============================================================================
 * {FILE} — {DESC}
 * @type data
 * @path {path-to-file}
 *
 * {brief purpose, source attribution}
 * ========================================================================== */
```

## Utilities / Lib (`*.ts` in `lib/`)

```ts
/* ============================================================================
 * {FILE} — {DESC}
 * @type utils
 * @path {path-to-file}
 *
 * {brief purpose}
 * ========================================================================== */
```

## Styles (`*.css`)

```css
/* ============================================================================
 * FILE:  {FILE}
 * ROLE:  STYLESHEET
 *
 * PURPOSE:
 *   {single sentence}
 *
 * @type styles
 * @path {path-to-file}
 * ========================================================================== */
```

## Config Files (`*.mjs`, `*.config.*`, `*.json`)

```js
/* ============================================================================
 * {FILE} — {DESC}
 * @type config
 * @path {path-to-file}
 * ========================================================================== */
```

JSON does not support comments. No header. Document purpose in CLAUDE.md.
