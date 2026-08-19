# splatoon-ui

## 0.2.3

### Patch Changes

- 41c4f11: Fix the heading tape docs preview width.

## 0.2.2

### Patch Changes

- 0b27059: Refine the component ref API so exported props carry explicit root refs instead of intersection types.
- c878204: Refine component encapsulation boundaries so private helpers stay out of the published API.
- bd09206: Fix the banner divider entrance animation.

## 0.2.1

### Patch Changes

- 5c0c96d: Expose the carousel public API and preserve packaged component styles.
- a1bb3ac: Expose the StapleCard public API.
- cde2e62: Expose the TornCard public API.
- 206b97b: Expose the RuggedCard public API.
- 122fd67: Expose the loader and icon button public APIs.
- a578775: Expose the form layout and typography public APIs.
- 6b16894: Refine the decorative component public APIs.
- ac9af50: Expose the wave button public API.
- d699c7a: Harden the public API entrypoints.
- 1392cde: Anchor the banner divider static position.

## 0.2.0

### Minor Changes

- 62728b0: Harden the public package API and docs surface for the stable component set.
  - Publish only the documented component entrypoints and server-safe root exports.
  - Regenerate component API and example docs from the stable public entrypoints.
  - Inline shadcn's Tailwind helper CSS during package builds so consumers do not install the shadcn CLI as a runtime dependency.
  - Add full-route docs smoke coverage for every locale and stable component page.
