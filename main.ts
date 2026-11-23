import { chmodSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

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

// The gate counts characters, not UTF-16 code units, so count code points:
// an astral character (emoji, rare glyph) is one character to the gate
// but two .length units. Count with the spread, not .length.
function oneLine(note: string): string {
  const chars = [...note].length;
  if (chars < 1 || chars > 160) {
    throw new Error(`patch note must be 1-160 characters, got ${chars}`);
  }
  if (note.trim().length === 0) {
    throw new Error("patch note must not be blank");
  }
  // Exactly one line: no newline, carriage return, tab or any other
  // control character that could split or hide a second line.
  for (const ch of note) {
    const code = ch.codePointAt(0)!;
    if (code < 0x20 || code === 0x7f) {
      throw new Error(
        `patch note must be a single printable line, got control character U+${code.toString(16).padStart(4, "0").toUpperCase()}`,
      );
    }
  }
  return note;
}

const note = oneLine(PATCH_NOTE);
mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_FILE, note, "utf8");
chmodSync(OUT_FILE, 0o644);

// Read the file back and refuse to finish unless what landed on disk is
// byte-for-byte the validated line — a silent truncation or encoding slip
// must fail loudly here, not surface later as a rejected entry.
const written = readFileSync(OUT_FILE, "utf8");
if (written !== note) {
  throw new Error(
    `wrote ${[...written].length} characters to ${OUT_FILE}, expected the ${[...note].length}-character patch note`,
  );
}
