# Card Stack Carousel Physics Design

**Date:** 2026-06-05

## Goal

Replace the current replayed keyframe swing in the stacked news carousel with a real impulse-driven pendulum model that:

- preserves the current horizontal card arrangement
- applies the same global motion input to all currently visible cards
- keeps per-card state boundaries so future single-card forces can be added cleanly
- does not retain off-screen card history

## Problem

The current implementation in `src/components/ui/card-stack-carousel.tsx` uses `swingKey` plus a fixed `rotate` keyframe array. That creates three structural problems:

1. repeated input in the same direction does not naturally accumulate momentum
2. animation playback depends on remount/retrigger tricks rather than physical state evolution
3. the model cannot grow into the official-style hanging-card behavior, where visible cards feel like independent objects receiving the same motion through a shared hanging system

## Constraints

- Keep the current `Carousel` primitive generic and unaware of physics.
- Keep `NewsCard` as the single card SSOT.
- Preserve the current visible-card arrangement and shell sizing work.
- Treat all currently visible cards as active participants in the same global motion event.
- Do not apply distance-based attenuation across visible cards.
- Do not preserve motion history for off-screen cards.
- Re-entering cards must reconnect to the current global motion state rather than restoring their prior private history.

## Recommended Architecture

### 1. Carousel index state stays where it is

`src/components/ui/carousel.tsx` continues to own:

- `currentIndex`
- `goToNext`
- `goToPrev`
- `goToIndex`
- item visibility decisions already derived by the scene layer

It must not gain pendulum state or frame-loop logic.

### 2. Physics lives in the card-stack scene layer

`src/components/ui/card-stack-carousel.tsx` becomes the scene-level motion owner.

It should own:

- the per-card physics registry
- the requestAnimationFrame loop
- global impulse injection for `next`, `prev`, indicator click, and swipe navigation
- synchronization of newly visible cards to the current shared hanging motion

### 3. View nodes only render current state

Each card view should render from resolved physics state:

- `angle`
- optionally derived visual helpers later, such as slight translate compensation

The view layer should not create its own independent timeline or keyframes.

## State Model

Two layers of state are required.

### Shared motion snapshot

This represents the current state of the shared hanging system that newly visible cards should join.

- `angle`
- `angularVelocity`
- `lastUpdatedAt`

This is not the only live state in the system. It is the synchronization source for cards that become visible after a global impulse has already been applied.

### Per-card physics state

Each visible card owns its own physics state object.

- `angle`
- `angularVelocity`
- `lastUpdatedAt`
- `isVisible`

Future-safe extension point:

- `pendingPrivateImpulse`

Current phase does not need to use private impulses, but the structure should make them additive rather than requiring a rewrite.

## Motion Semantics

### Global input

When the user triggers carousel movement:

- `next` injects a signed global impulse in one direction
- `prev` injects the opposite signed global impulse
- swipe gestures inject the same kind of signed global impulse
- indicator jumps should inject a capped impulse based on navigation direction, not raw index distance

That impulse is applied to all currently visible cards equally.

### Visible-card behavior

All currently visible cards:

- receive the same global impulse
- evolve independently using their own `angle` and `angularVelocity`
- do not receive distance-based attenuation

This matches the chosen physical metaphor: cards hang from a shared invisible string system and are moved together through the top hanger.

### Off-screen behavior

Cards that leave the visible window:

- are removed from the active physics registry
- do not continue integrating off-screen

Cards that re-enter:

- do not restore old private history
- are initialized from the current shared motion snapshot

This keeps the current phase performant and architecturally clean while preserving a future path to off-screen persistence if ever needed.

## Integration Rules

The frame loop should run only while there is meaningful motion.

For each active card on each frame:

1. compute `dt` from `lastUpdatedAt`
2. apply any pending global/private impulse to `angularVelocity`
3. apply restoring force toward `angle = 0`
4. apply damping to `angularVelocity`
5. integrate `angle += angularVelocity * dt`
6. clamp tiny values to zero to stop sub-pixel idle jitter

The shared motion snapshot should be updated from the same step so newly visible cards can join the current motion seamlessly.

## Parameters

The exact numbers should remain configurable scene constants in `card-stack-carousel.tsx`.

Required tunables:

- `globalImpulseStrength`
- `restoringForce`
- `damping`
- `maxAngleDeg`
- `settleVelocityEpsilon`
- `settleAngleEpsilon`

The initial implementation should prefer a restrained range. The motion should feel like paper cards hanging from a top slot, not a loose signboard.

## Event Sources

The following events must inject physics input through the same code path:

- next button
- previous button
- drag/swipe completion
- indicator click
- click-to-focus on a visible non-active card

This avoids drift between different navigation affordances.

## Rendering Strategy

Keep the existing `motion.div` card shell for layout transitions if needed, but the swing rotation should come from resolved physics state rather than keyframe arrays.

Preferred render contract:

- deck translation remains driven by current carousel offset
- swing rotation uses the per-card resolved `angle`
- transform origin remains `50% var(--card-hanger-y, ...)`

Do not keep `swingKey`, remount-triggered animation replay, or fixed rotate keyframe arrays once the physics path is live.

## Testing Strategy

### Regression verification

Add a focused browser verification that proves:

1. first `next` click produces non-zero swing
2. second consecutive `next` click before settling increases or at least preserves non-zero motion
3. a newly visible card joins with non-zero swing rather than entering at rest
4. the system settles back to near zero without persistent jitter

### Static verification

Run:

- `pnpm typecheck`
- targeted `eslint` for modified files

### Visual verification

Use `http://localhost:3000/`, not `127.0.0.1:3000`, for interaction verification on this machine.

Capture before/after screenshots if the visible behavior changes materially.

## Non-Goals For This Phase

- perfect one-to-one reproduction of the final official hanging physics
- off-screen historical state persistence
- per-card extra localized impulses from direct pointer hits
- rope rendering or explicit shared-string visuals
- reworking current card arrangement again

## File Impact

Primary file:

- `src/components/ui/card-stack-carousel.tsx`

Likely no required contract changes:

- `src/components/ui/carousel.tsx`
- `src/components/ui/news-carousel.tsx`
- `src/components/ui/news-card.tsx`

Optional verification artifact:

- `scratch/verify-carousel-repeat-swing.mjs` can be replaced or expanded into a stronger physics verification script

## Decision Summary

Use per-card physics state plus a shared motion synchronization source.

This is the cleanest current solution because it:

- matches the chosen physical metaphor
- supports repeated impulse accumulation cleanly
- keeps each card as an independent future extension point
- avoids premature off-screen state retention
- prevents another rewrite when single-card forces are added later
