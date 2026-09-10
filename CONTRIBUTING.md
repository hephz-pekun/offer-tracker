# Contributing

This project is used as a teaching codebase for a CodePath capstone course, but
it's a real, working app and contributions from anyone are welcome — the
workflow below is exactly how you'd contribute to any open source project.

## Workflow

1. Find an issue you'd like to work on. If you're new, start with one labeled
   [`good-first-issue`](../../issues?q=is%3Aissue+is%3Aopen+label%3Agood-first-issue).
2. Comment on the issue to claim it, so two people don't work on the same thing.
3. Create a branch off `main`.
4. Make your change. Keep it scoped to the issue — small, focused PRs are much
   easier to review than ones that fix five things at once.
5. Run the checks locally before opening a PR:
   ```bash
   npm run lint
   npm run typecheck
   npm test
   ```
6. Open a PR referencing the issue (e.g. "Closes #12"). Fill out the PR
   template, including a screenshot if you changed anything visual.
7. CI must be green before merge.

## Labels

- **Difficulty**: `good-first-issue` (single file or small, well under an hour),
  `intermediate` (a new model/migration or changes across a few files),
  `advanced` (a new subsystem or something cross-cutting).
- **Type**: `bug`, `feature`, `docs`.

## Working with the database

This project uses Prisma + SQLite. If your issue needs a schema change:

```bash
npx prisma migrate dev --name <short-description>
```

This updates `prisma/schema.prisma`'s corresponding migration and applies it to
your local `prisma/dev.db`. Commit the generated migration folder along with
your schema change.

If your local database ever gets into a confusing state, reset it:

```bash
npm run db:reset
```

This drops the local database, reapplies all migrations, and re-seeds it.

## Code style

- TypeScript strict mode is on — don't work around type errors with `any`.
- Run `npm run lint` before opening a PR; ESLint and Prettier formatting are
  already configured.
- Follow the patterns already in the codebase (e.g. how `lib/applications.ts`
  is structured, or how existing components are composed) rather than
  introducing a new pattern for a small change.

## Questions

Open a [discussion](../../discussions) or ask in the issue you're working on.
