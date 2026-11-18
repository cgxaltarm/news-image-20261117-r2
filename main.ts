// news-image-20261117 r2 — Tuesday 17 November 2026, 50 stories in one image.
//
// The front page in this repo was drawn for the competition: a navy
// masthead dated Tuesday 17 November 2026, a region strip (Europe 10,
// Middle East 7, Asia 9, Africa 8, Americas 7, Oceania 4, World 5),
// three illustrated lead stories, ten more illustrated grid stories,
// a world map with numbered pins, the remaining 37 stories grouped by
// region, a by-field bar chart, and a DATE CHECK box naming two stale
// stories left out on purpose. Every illustration is a flat shape
// drawn by hand in the build script; no text comes from a generator.
//
// This program places that finished artwork where make.fun expects it:
// it copies entry.png into MAKEFUN_OUTPUT_DIR (default /output) and
// checks the copy is a real PNG of the same size, so the judged bytes
// are exactly the artwork in this repo.

import { createHash } from "node:crypto";
import { copyFileSync, readFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.png");

const sourceBytes = readFileSync(source);
if (sourceBytes.length === 0) {
  throw new Error(`entry image is empty: ${source}`);
}
const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!sourceBytes.subarray(0, 8).equals(pngMagic)) {
  throw new Error(`entry image is not a PNG: ${source}`);
}
const sourceHash = createHash("sha256").update(sourceBytes).digest("hex");

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outputDir, { recursive: true });

const destination = join(outputDir, "entry.png");
copyFileSync(source, destination);

// Verify the copy byte-for-byte: same size and same sha256 as the repo artwork.
const copied = readFileSync(destination);
const copiedHash = createHash("sha256").update(copied).digest("hex");
if (copied.length !== sourceBytes.length || copiedHash !== sourceHash) {
  throw new Error(`copied entry.png differs from the repo artwork: ${destination}`);
}

console.log(`Wrote ${destination} (${copied.length} bytes, sha256 ${copiedHash})`);
