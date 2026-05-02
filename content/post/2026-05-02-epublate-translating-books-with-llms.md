---
layout:      post 
draft:       false
title:       "epublate: Saving My Audiobook Addiction One ePub at a Time"
subtitle:    "A terminal tool that translates ePub books with two LLMs and a shared lore bible — so my favourite series doesn't die mid-trilogy"
date:        2026-05-02
author:      "Thiago MadPin"
URL:         "/2026/05/02-epublate-translating-books-with-llms/"
image:       "/img/posts/2026-05-02-epublate-translating-books-with-llms.png"
description: "I'm an audiobook addict who listens in Portuguese. The problem: half my series stop translating after book 2, and the ones that exist often have no audio version. ElevenReader fixed the audio side. epublate, my new terminal tool, fixes the translation side — using two LLMs and a shared lore bible so character names, places, and magic systems stay consistent across the whole series."
categories:  [ Tech ]
tags:
    - audiobooks
    - llm
    - python
    - projects
    - open source
---

# TL;DR 🎧📚

I love audiobooks. I listen in Portuguese. Half my series die mid-trilogy because nobody finished translating them, or nobody recorded the audio.

So I built **`epublate`** — a terminal tool that translates ePub books with an LLM, keeps a per-project lore bible (so names don't drift across 800 pages), and shares that lore across books in the same series.

Hand the translated ePub to ElevenReader, press play, walk to work. Problem solved.

Code: [github.com/madpin/epublate](https://github.com/madpin/epublate). MIT.

---

# Confession: I'm an audiobook addict 🎧

I listen to audiobooks all day.

Walking to the office. Cooking. Doing the dishes. Pretending to clean the apartment. On the bus. On the walks.

It's the perfect ADHD hack. My hands are busy, my eyes are wherever, and my brain is happily following a story instead of spiralling about whatever it would otherwise spiral about.

But there's a catch. Actually, there are three.

# Catch #1: They have to *exist*

You can only listen to what's been recorded. No audio version, no audiobook. Simple as that.

A *lot* of great books just… don't have one. The older the book, the worse it gets. Self-published stuff, niche genres, anything from a small press — odds are slim.

# Catch #2: I listen in Portuguese 🇧🇷

This shrinks the catalogue dramatically.

The English audiobook market is huge. The Portuguese one? Way smaller.

Most international hits get translated to text — eventually. Audio? Often never. Or only the first book. Or only the first three out of nine.

# Catch #3: Series die mid-trilogy 💔

This is the heartbreaker.

You start a series. You fall in love with the characters. You finish book 1. Book 2 — translated! Audio version — yes!

Book 3? *"Em breve."* Forever.

Sometimes the publisher gave up. Sometimes the audiobook studio gave up. Sometimes both. Either way, you're stuck.

> [!INFO]
> *"Em breve"* is the Portuguese version of *"Coming soon™"*. In publisher-speak, it usually means *"we're not telling you no, but also no."*

# Then ElevenReader walked in 🎙️

A few months ago I started using [ElevenReader](https://elevenreader.io). It's a TTS app powered by ElevenLabs voices, and… honestly, it's wild.

You hand it an ePub. It reads it back to you with voices that don't sound like a 1998 GPS unit. Different characters get different voices. Pacing is natural. Long sessions don't make your ears bleed.

So suddenly **Catch #1 was solved**. Any ePub becomes an audiobook.

But the Portuguese problem? Still there. Big as ever.

If the book doesn't exist as an ePub in Portuguese, ElevenReader can't help me. And running a chapter through Google Translate produces something that vaguely resembles a book but reads like a microwave manual.

> [!IDEA]
> Half a solution is great. It's also frustrating. Once you taste "any book is an audiobook", you start noticing all the books that *aren't* in your language.

# So I built `epublate` 🛠️

`epublate` = **epub** + transl**ate**. Pronounced *ep-yoo-blate*, because of course it is.

It's a terminal tool that takes an ePub, feeds it to an LLM chunk by chunk, and gives you back a translated ePub on the other side. Italics, footnotes, chapter structure, images — all preserved.

Then ElevenReader picks it up and reads it to me on the way to work.

Easy, right? Well — *"feed it to an LLM"* is the easy part. The hard parts are what made me actually sit down and build this.

## Hard part 1: names drift

Translate chapter by chapter without giving the LLM any memory, and *Élise* in chapter 1 becomes *Elise* in chapter 5 and *Eliza* by chapter 12. Same with places, magic systems, organisations, weird invented words.

Fantasy and sci-fi are the worst offenders. There's *always* a magic school, a guild, or a made-up word that needs a careful translation choice — and then needs to stay that way for 800 pages.

## Hard part 2: format gets flattened

Most "just translate this text" pipelines either:

- Strip the HTML and lose the formatting, or
- Hand the LLM raw HTML and pray (the LLM happily edits your tags)

Either way, your beautiful ePub turns into ASCII soup.

# How epublate tackles both 🧰

Two ideas, both stolen from how a real human translator would actually work.

## 🤖 Two LLM models, not one

Most LLM tools use one model for everything. epublate uses two:

- **The translator.** A capable model. Smart, good with literature, costs you tokens. This one does the actual paragraph-by-paragraph translation.
- **The helper.** A cheap, fast model. This one does the boring jobs — scanning chapters for proper nouns, suggesting glossary entries, doing pre-passes before each chapter, sniffing the tone of the book before you even hit *Create*.

> [!TIP]
> The split lets the smart model focus on the artistic call. The cheap one does the inventory work that would otherwise burn your wallet for no reason.

You point both at any **OpenAI-compatible** endpoint — OpenAI, Azure, OpenRouter, Together, or your own Ollama / vLLM / llama.cpp box. Same protocol, just different model names in the env vars.

```bash
export EPUBLATE_LLM_MODEL=gpt-5-mini          # the translator
export EPUBLATE_LLM_HELPER_MODEL=gpt-5-nano   # the cheap helper
```

## 📖 The lore bible (the secret sauce)

This is the part I'm most excited about.

epublate keeps a **per-project lore bible** in SQLite. Every time the LLM (or you) decides *"Élise stays Élise in Portuguese"*, it gets locked in. Every later chapter sees that decision *before* translating.

Entries have three states:

| Status      | Meaning                                                                  |
| ----------- | ------------------------------------------------------------------------ |
| `proposed`  | The helper LLM suggested it. Waiting for you to look.                    |
| `confirmed` | You approved it. The translator uses it from now on.                     |
| `locked`    | Set in stone. A mechanical validator *blocks* any drift.                 |

> [!IMPORTANT]
> "Locked" means the validator is on duty. If the translator ever outputs a different version of a locked name, that segment gets flagged in the inbox before it ships. **Drift becomes mechanically impossible** — not a guideline, a wall.

## 🧬 The lore bible travels between books

Here's the part that made me actually finish building this thing.

If you're reading *book 4* of a series, you've already made hundreds of choices about character names, places, magic systems, weird made-up swearwords. Re-doing them every book is insane.

epublate lets you **share the lore bible across projects** in the same series. Translate book 1, lock the choices, then book 2 starts already knowing who Élise is and what the Marenglade Citadel is called.

It's the closest thing to having a real translator's working notebook — but for the LLM.

> [!EXAMPLE]
> Translate *The Citadel* (book 1). Lock 40 names and places. Drop the same lore into the *Pride and Prejudice of the Citadel* project (book 2). The translator already knows everything from book 1 on the very first segment.

# What it actually looks like 👀

The whole thing runs in a terminal. No web app, no Electron, just a proper TUI built with Textual.

You get:

- A **project dashboard** with progress, cost, flagged segments, recent activity
- A **side-by-side reader** — source on the left, translation on the right
- A **glossary editor** for the lore bible
- A **curator inbox** for anything the translator wasn't confident about
- A **batch mode** that translates everything in the background while you go for a walk
- A **cost meter** with a budget cap, so the LLM bill doesn't surprise you on Sunday morning

It's all keyboard-driven. `t` translates, `a` accepts, `g` opens the glossary, `?` shows the cheat sheet, `q` quits. Three themes (dark, light, high-contrast) on `T`.

> [!NOTE]
> Why a terminal app and not a web UI? Because I wanted to write it in Python with Textual. Because it's *my* tool. And because I already have eight terminals open at any given time. Mostly the third reason.

# How to actually try it 🚀

Bare-bones flow, assuming you've got an API key for any OpenAI-compatible model:

```bash
uv tool install epublate

export EPUBLATE_LLM_BASE_URL=https://api.openai.com/v1
export EPUBLATE_LLM_API_KEY=sk-...
export EPUBLATE_LLM_MODEL=gpt-5-mini
export EPUBLATE_LLM_HELPER_MODEL=gpt-5-nano

epublate new ./book.epub \
    --source-lang en --target-lang pt \
    --out ~/Documents/epublate/my-book

epublate open ~/Documents/epublate/my-book
```

From the dashboard, hit `b` to start a batch translation, `g` to look at the glossary, `o` to read segment by segment, or `B` to set a budget cap.

When you're happy, `epublate export` spits out a translated ePub. Drop it into ElevenReader. Press play. Go for a walk.

> [!TIP]
> Don't have an API key? Add `--mock-llm` to any command and the whole TUI works against a fake model. Great for kicking the tyres before paying for tokens.

# Where this goes from here 🛤️

`epublate` is at v1. All milestones M0 through M6 landed. PDF support is planned but not in v1 (the format layer is pluggable on purpose). Embedding-based retrieval for style consistency is on the stretch list.

But for now, my own use case is covered:

1. Find an ePub in English of the next book in my series.
2. Translate it with epublate, sharing the lore bible from book 1.
3. Hand the translated ePub to ElevenReader.
4. Walk to work, listen to chapter 1.
5. Smile.

> [!QUOTE]
> Anyone who tells you LLMs can't do creative work right has never had to find an audiobook in Portuguese for the third book of an obscure trilogy.

Code lives at [github.com/madpin/epublate](https://github.com/madpin/epublate). MIT licensed. PRs welcome — *especially* if you're a polyglot reader stuck mid-series like I was.

And if you find a series that *I* should translate next, hit me up.

Sláinte! 🍻
