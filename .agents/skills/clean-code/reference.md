# Reference — barrels & naming

## Barrel hierarchy

- Each level re-exports from the **child** `index.ts`, not every leaf.
- Prefer explicit named re-exports over `export *` on large trees.

```ts
export { SidebarPrimaryNav, SidebarAccountMenu } from './sidebar'
```

| Barrel                       | Include                                                  | Exclude                                 |
| ---------------------------- | -------------------------------------------------------- | --------------------------------------- |
| `features/<name>/index.ts`   | Shared components, cross-cutting types, API, route pages | Private subcomponents, one-off helpers  |
| `components/shared/index.ts` | Composable UI used by multiple features                  | Feature API modules, feature-only hooks |

### When you move a file

1. Move the file.
2. If a new subfolder is imported from outside → add/update its `index.ts`.
3. Update the parent barrel.
4. Do not change consumer paths if they already use the top-level barrel.

## Naming

- Components: PascalCase by intent (`SettingsProfileForm`).
- Files: match primary export (`useSearchFilter.ts`, `course.types.ts`).
- Functions: outcome verbs (`get…`, `build…`, `normalize…`).
- Booleans: questions (`isLoading`, `canEdit`).
