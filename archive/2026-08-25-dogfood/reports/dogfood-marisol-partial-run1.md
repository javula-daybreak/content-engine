# Dogfood run — Marisol Okonjo-Reyes (`marisol`)

Director of Perioperative Operations, 400-bed nonprofit hospital system. 14 years.
First-time user. Claude Code was installed by someone on my team. I started at
`README.md` and nothing else.

Status: IN PROGRESS

---

## Findings

### F-1 — The only command in the README does not exist
- Where: `README.md`, lines 3-6 (the install block), step 0
- Instruction as written:
  ```
  cp -R "content engine" ~/.claude/skills/content-engine
  /content-engine setup
  ```
- What I did: My teammate set Claude Code up for me, so I assumed the copy was
  done and typed the second line, `/content-engine setup`.
- What happened: `Unknown skill: content-engine`. I also checked
  `ls ~/.claude/skills/` and there is no `content-engine` directory there —
  43 other skills, none of them this one.
- What I expected: The README says "That is the whole install." I expected the
  slash command to work, or to be told what to do when it doesn't.
- Severity: blocker
- Had to leave the docs: yes — I had to `ls` the repo root to find something
  that looked like instructions, which the README never told me to do.

### F-2 — The install line can only be run from a directory the README never names
- Where: `README.md` line 4, step 0
- Instruction as written: `cp -R "content engine" ~/.claude/skills/content-engine`
- What I did: Ran it verbatim from the folder I was handed.
- What happened:
  ```
  cp: content engine: No such file or directory
  exit=1
  ```
- What I expected: The command to work where I am. There is no `cd` anywhere in
  the README, and the folder I'm sitting in is the content engine — there is no
  sub-folder called "content engine" inside it. So the one install command is
  written from the point of view of somebody standing one directory up, and
  never says so. A person who was handed this folder cannot run it.
- Severity: blocker
- Had to leave the docs: no (but only because I gave up on the command)

### F-3 — Nothing tells you `SKILL.md` is the thing to read
- Where: repo root, after F-1 and F-2
- Instruction as written: (none — this is the absence)
- What I did: Listed the root directory looking for a way in. Found `SKILL.md`
  (29 KB), `content-engine-PRD.md` (169 KB), `content-engine-VISUALS.md`
  (117 KB), `content-engine-CORRECTION.md` (31 KB), and folders `workflows/`,
  `reference/`, `render/`, `archive/`, `profiles/`. The README names the PRD and
  VISUALS files by name but never names `SKILL.md`, which is the file that
  actually contains the setup interview.
- What happened: I guessed `SKILL.md` because it was the smallest markdown file
  whose name wasn't "spec". That is a guess.
- What I expected: If the slash command is broken, the README's fallback should
  be one line: "or open SKILL.md and follow it."
- Severity: friction (blocker if you don't guess right — the PRD is 169 KB and
  the README calls it "the single source of truth", so the obvious wrong guess
  is to open a 169 KB spec)
- Had to leave the docs: yes

### F-4 — With the slash command dead, the human has to hand-run the engine
- Where: `SKILL.md` §1, `workflows/setup.md` opening line
- Instruction as written: "Load `reference/interview.md` first and be that
  person for the whole run."
- What I did: I asked Claude to read `SKILL.md` and run setup for me, since the
  slash command didn't exist. That is the workaround my teammate would have
  suggested.
- What happened: It worked, but only because Claude will read a 30 KB router
  file, a 18 KB workflow, and a 6 KB persona file and then act on them. Nothing
  in the README says that is the fallback. I am the one holding the pipeline
  together.
- What I expected: One command that works.
- Severity: friction (downstream of the F-1 blocker; noting it because
  everything below happened via this workaround, not via the product)
- Had to leave the docs: yes

