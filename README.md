# Recursive Partitioning Frontend Challenge

Interactive recursive partitioning canvas built with React, MobX, and Tailwind CSS.

The app starts with one full-screen block. Each leaf block can be split horizontally or vertically, producing a binary partition tree. You can drag the divider to resize splits and remove non-root blocks.

## Live Behavior

- `v`: Split the current leaf vertically.
- `h`: Split the current leaf horizontally.
- `-`: Remove the current leaf (not available on the root partition).
- Drag divider: Resize sibling partitions with snapping near `25%`, `50%`, and `75%`.

## Tech Stack

- React 18
- TypeScript + Vite
- MobX + mobx-react-lite
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- npm

### Install

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Available Scripts

- `npm run dev`: Start Vite dev server.
- `npm run build`: Type-check and build production assets.
- `npm run lint`: Run ESLint.
- `npm run preview`: Serve the built output locally.

## How It Works

### Data Model

The state is managed in a MobX store as a map of partitions keyed by `id`.

Each partition can be:

- A leaf node: Has a `color` and no `children`.
- An internal node: Stores `splitDirection`, `splitRatio`, and two child IDs.

This forms a recursive binary tree rooted at `root`.

### Split Operation

When splitting a leaf:

1. Two child partitions are created.
2. First child keeps the current color.
3. Second child receives a random color.
4. Parent becomes an internal node with default ratio `0.5`.

### Remove Operation

When removing a non-root partition:

1. Parent and sibling are identified.
2. The selected partition subtree is deleted.
3. Sibling state is promoted into the parent.
4. Sibling node is removed.

This keeps the tree valid without leaving orphan nodes.

### Resize Behavior

While dragging a divider:

- Ratio is calculated from pointer position relative to the partition container.
- Ratio is clamped to `[0.1, 0.9]`.
- Ratio snaps near `0.25`, `0.5`, `0.75` with a small threshold.

## Project Structure

```text
src/
   App.jsx
   main.tsx
   index.css
   components/
      PartitionView.tsx
   store/
      partitionStore.ts
```

## Notes

- The root partition cannot be removed by design.
- Colors are selected from a predefined palette in the store.
- UI is intentionally minimal to focus on partition logic and interaction.
