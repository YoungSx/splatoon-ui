# splatoon-ui

## 0.2.0

### Minor Changes

- 62728b0: Harden the public package API and docs surface for the stable component set.
  - Publish only the documented component entrypoints and server-safe root exports.
  - Regenerate component API and example docs from the stable public entrypoints.
  - Inline shadcn's Tailwind helper CSS during package builds so consumers do not install the shadcn CLI as a runtime dependency.
  - Add full-route docs smoke coverage for every locale and stable component page.
