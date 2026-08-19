# Hooks

35 named hook patterns. `brief.md` carries `hook_id:`, and the repetition guard
locks on it: no reuse inside the trailing 8 shipped posts, no more than twice in
any trailing 20, and no reuse of the same thesis and hook pair inside 30 days.
Those three windows are why this file holds 35 patterns and not 12. See PRD
section 3.

**The id is the contract.** Rename one and every brief written before the rename
points at nothing. The lock does not error when that happens, it just stops
binding, which is the failure mode PRD section 3 built the lock to prevent.
Retire a pattern by striking it, the way `ai-tells.md` retires a tell. Never
rename one.

## Two rules for the example lines

Every line in this file starting with `> ` is an example line, and nothing else
in this file may start with `> `. That character sequence is the whole
convention, per PRD section 13.2 step 4.

**An example line carries no fact.** Slots stay in angle brackets. PRD section
1.2 bans fiction anywhere in the repo, and this file loads at draft time, which
makes it the shortest leak path in the engine. A concrete number written here as
illustration is a fabricated number a model can lift straight into a real post,
past a specifics floor that would then read the draft as satisfied. Shapes also
happen to be what a hook pattern actually is. The sentence is the writer's job.

**An example line clears the gate.** `node reference/engine.js gate --hooks`
runs every one of them through the same lexical and stats checks a draft gets,
and a pattern the gate would rewrite cannot ship here. Section 9 bans the
antithesis and the one-word rhetorical fragment by name, and both are hook
shapes people reach for, so without this check the engine ships a library it
argues with on run two. The absence checks are exempt: they measure a whole
post, and one quoted line has no paragraphs and names nobody.

## How the router picks one

The angle comes first and the hook comes second. An angle is one inventory item
crossed with one thesis, aimed at something the audience believes and is wrong
about. The hook is the door into that argument, so it is chosen from the shape
of the anchor: a story takes a different door than a number does.

Read `engine.js locks` before choosing, take the unlocked pattern that fits the
anchor best, and write the id into `brief.md` before drafting. When the fit is
poor for every unlocked pattern, that is a signal about the anchor rather than
about this file. Pick a different anchor.

## The patterns

### confession
Admit the mistake first, with no lesson attached to it yet. Stops the scroll
because status is the currency of the feed and someone spending it is worth
watching.
> I <did the wrong thing> for <duration> before anyone caught it.

### number
Open on one figure with no setup around it. Stops the scroll because a numeral
is the only thing on the page that cannot be skimmed as an opinion.
> <figure>. That is <what it measures>, over <period>.

### correction
State the old belief in full, then the specific part of it that broke. Stops the
scroll because a person changing their mind in public is rare enough to be news.
> I spent <duration> believing <belief>. I was wrong about <specific part>.

### overheard
A verbatim line somebody said to you, as the first thing on the page. Stops the
scroll because dialogue reads as an event and the reader is already mid-scene.
> <role> told me, "<verbatim line>".

### refusal
Name a thing you decided not to do. Stops the scroll because the feed is
saturated with what people did and nearly empty of what they declined.
> We turned down <thing> last <period>. Here is what it would have cost.

### cost
Open on the price in money, hours, or people. Stops the scroll because a cost is
a claim the writer has to stand behind, so it reads as testimony.
> <thing> cost us <figure> and <duration>. The <figure> was the cheap part.

### before-after
Two states with no bridge between them. Stops the scroll because the gap is the
question, and the reader has to open the post to close it.
> <period> ago: <state>. Today: <state>.

### question-to-one-person
A question addressed to one named role rather than to the feed. Stops the scroll
because everyone else can tell it is not for them, and the one person it is for
cannot look away.
> If you run <function> at <company size>, how do you handle <specific>?

### unpopular
The position your peers would push back on, first line, unhedged. Stops the
scroll because disagreement is the only thing on LinkedIn that reliably produces
a comment instead of a reaction.
> <flat statement of the position>. I have argued this for <duration> and I have
> not moved.

### receipt
A document, a clause, a line from a contract. Stops the scroll because a
primary source outranks an opinion and reads as evidence on sight.
> The <document> says "<quoted clause>". Nobody reads that line until <event>.

### timeline
Open with a date, then what happened on it. Stops the scroll because a date is a
commitment to specifics and signals that the post is about a real thing.
> On <date> we <action>. By <date>, <consequence>.

### pattern
Repetition as evidence: the third time this month, with the same cause. Stops
the scroll because one incident is a story and three is a structural problem.
> That is the third <thing> this <period> with the same <cause>.

### misread
What everyone reads the data as saying, then what the data says. Stops the
scroll because it puts the reader on the wrong side of a fact and offers them a
way back.
> Everyone reads <data> as <conclusion>. Read the <column> and you get <other
> conclusion>.

### smallest-unit
One customer, one ticket, one call. No aggregate anywhere. Stops the scroll
because a single case is legible in the two seconds an average is not.
> One <customer or ticket>. <duration> to resolve. Here is the whole of it.

### the-ask
Open on what somebody asked you for. Stops the scroll because a request implies
a relationship and a stake, and the reader wants to know what you said.
> <role> asked me for <thing> on <day>. What they needed was <other thing>.

### job-description
Describe the work nobody has a title for. Stops the scroll because the people
who do that work have never seen it written down.
> Most of my <period> goes to <unnamed work>. There is no title for it.

### disagreement
Name who you disagree with and state their case at its strongest. Stops the
scroll because the fair version of an opponent is so rare that it reads as
credibility before the argument even starts.
> <name or camp> argues <strongest version of their case>. I think <counter>,
> and here is exactly where we split.

### constraint
The limit you work inside, stated flat, with no complaint attached. Stops the
scroll because constraints are what practitioners recognise and commentators
never mention.
> We have <resource> and <deadline>. Everything below follows from those two
> numbers.

### handoff
The moment work passes between two people and breaks. Stops the scroll because
every reader has a handoff that breaks and has never seen anyone name it.
> <function> hands <artifact> to <function>. That is where <failure> starts.

### what-it-replaced
The old thing, described properly, including what it actually did well. Stops
the scroll because the honest account of the old way is the tell that you have
run both.
> Before <tool>, <person> did <task> by <method>. That took <duration> a week.

### quiet-part
The thing everyone in the room knew and nobody put in the deck. Stops the scroll
because the reader recognises the room.
> Everyone on that call knew <fact>. It stayed off the deck.

### two-numbers
Two figures side by side that should agree and do not. Stops the scroll because
the contradiction does the work and needs no adjective.
> <system> says <figure>. <other system> says <figure>. Same <period>.

### first-day
What you did not know at the start. Stops the scroll because it hands the newest
person in the audience a seat at the table.
> On my first <period> in <function> I thought <belief>. Nothing about that
> survived <period>.

### withdrawal
A phrase you used to say and stopped saying. Stops the scroll because it is a
small, concrete, checkable change rather than a claim of growth.
> I stopped saying "<phrase>" in <period>. Here is what replaced it.

### demo
Watching something work or fail, in the present tense. Stops the scroll because
running beats described, and the reader can smell the difference.
> I watched <thing> run against <input> this morning. It <outcome> at <step>.

### price-of-being-right
You were right and it cost you anyway. Stops the scroll because it refuses the
shape every other post on the feed is using.
> I was right about <call> and it cost me <consequence>.

### the-boring-answer
The unglamorous mechanism behind a visible outcome. Stops the scroll because
readers arrive expecting a secret and the absence of one is more useful.
> People ask how <visible outcome> happened. It was <unglamorous mechanism>, run
> every <period>.

### who-pays
Name the party who absorbs the cost of a common practice. Stops the scroll
because it reassigns a cost the reader had filed as free.
> When <practice> happens, <party> absorbs it. They are never in the room for
> that decision.

### definition
Take a word everyone uses and say what it means in your work. Stops the scroll
because the reader has been nodding along to that word for years.
> <word> means <operational definition> here. Elsewhere it means <vaguer thing>,
> which is why <consequence>.

### rejected-plan
The option you did not take, described as fairly as the one you did. Stops the
scroll because the runner-up is where the actual reasoning lives.
> We nearly did <option>. Here is the version of it that almost won.

### scale-shift
The same process at ten times the volume. Stops the scroll because it separates
the people who have run it from the people who have read about it.
> <process> works at <small n>. At <large n> it <failure mode>.

### inherited
What you took over and what you found when you opened it. Stops the scroll
because inheriting a mess is universal and almost never written about honestly.
> I took over <thing> in <period> and found <state>.

### one-line-brief
The entire argument in one sentence, then the evidence underneath it. Stops the
scroll because it respects the reader who was going to skim anyway.
> <the whole argument in one sentence>. The rest of this is evidence.

### wrong-room
The channel where the decision actually got made. Stops the scroll because
everyone suspects this happens and nobody says it out loud.
> The decision on <thing> got made in <channel>, before the meeting about it.

### still-open
Name the question you have not answered. Stops the scroll because an open
question invites a reply in a way a conclusion cannot.
> I do not have an answer to <question>, and it has been <duration>.

## Retiring a pattern

Strike the heading and leave it in place, with the date and the reason, the way
`ai-tells.md` retires a tell:

`### ~~pattern-id~~` struck YYYY-MM-DD, <reason>

The entry stops being selectable and stays readable, and every brief that
already carries the id still resolves. Deleting the entry instead breaks the
history, and reusing the id later silently merges two different patterns inside
one lock window.
