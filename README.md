# commit-now

[![npm version](https://img.shields.io/npm/v/commit-now.svg)](https://www.npmjs.com/package/commit-now)

AI‑assisted git commit tool (Conventional Commits)

## Features

-  Generates commit messages using AI (Lunos API, supports OpenAI/Gemini models)
-  Follows the [Conventional Commits](https://www.conventionalcommits.org/) specification
-  Automatically stages unstaged changes before commit
-  Supports both short (title only) and long (title + body) commit messages
-  Configurable API key and model, saved locally
-  Modular TypeScript codebase (see `src/`)

## Installation

You can install via [npm](https://www.npmjs.com/package/commit-now):

```sh
npm install -g commit-now
```

Or clone the repo and install dependencies with pnpm:

```sh
pnpm install
```

Build (optional, for production):

```sh
pnpm run build
```

## Usage

From the project root, run:

```sh
pnpm start -- [options]
```

Or, if you have built to `dist/`:

```sh
node dist/index.js [options]
```

Or, if installed globally with npm:

```sh
cnow [options]
```

### Options

-  `-s`, `--short` Generate a short commit message (title only)
-  `-l`, `--long` Generate a long commit message (title + body)
-  `-k`, `--key` Set and save your Lunos API key
-  `-m`, `--model` Set and save your preferred model

If you run with `-k` or `-m`, the config is updated and the process exits.

### Example

```sh
cnow -l
```

## Configuration

Config is stored in `.config.json` in the same directory as the script (not in your home directory).

-  API key and model are prompted for on first use, or can be set with CLI flags.
-  **You can get your Lunos API key from [https://lunos.tech/dashboard/api-keys](https://lunos.tech/dashboard/api-keys)**

## Development

-  Source code is in the `src/` directory, split by purpose:

   -  `src/index.ts` — Main entry point
   -  `src/config.ts` — Config helpers
   -  `src/git.ts` — Git helpers
   -  `src/lunos.ts` — Lunos API logic
   -  `src/cli.ts` — CLI and credential logic

-  Build output goes to `dist/`.
-  TypeScript config is set up for `src/` as root.

## License

MIT

---

For more details, see the [npm package page](https://www.npmjs.com/package/commit-now).
