import { chmodSync, mkdirSync, writeFileSync } from "node:fs";

// Real-Life Patch Notes: The Comedy Changelog — make.fun entry.
//
// One line, at most 160 characters: a software patch note for a bug in
// real life / human biology, in the terse register of a real release note.
//
// The bug: the tip-of-the-tongue state. You know the word, your brain
// refuses to load it, and then — at 3 a.m., when it is useless — it
// serves it up. A bug everyone has hit, with a fix stated as if shipped.
const PATCH_NOTE =
  "v6.0.1: fixed a bug where the brain knew a word, refused to load it, then served it up at 3 a.m. instead.";

const OUT_DIR = "/output";
const OUT_FILE = `${OUT_DIR}/entry.txt`;

// The gate allows 1-160 characters of UTF-8 text, not whitespace only,
// and the entry must be exactly one line — refuse to write anything else.
function oneLine(note: string): string {
  if (note.length < 1 || note.length > 160) {
    throw new Error(`patch note must be 1-160 characters, got ${note.length}`);
  }
  if (note.trim().length === 0 || note.includes("\n")) {
    throw new Error("patch note must be a single non-blank line");
  }
  return note;
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_FILE, oneLine(PATCH_NOTE), "utf8");
chmodSync(OUT_FILE, 0o644);
