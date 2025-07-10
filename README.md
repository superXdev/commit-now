# commit-now

[![npm version](https://img.shields.io/npm/v/commit-now.svg)](https://www.npmjs.com/package/commit-now)

AI‑assisted Git commit tool adhering to the Conventional Commits specification

## Features

- Generates commit messages using AI (Lunos API; supports OpenAI and Gemini models)
- Enforces the [Conventional Commits](https://www.conventionalcommits.org/) standard
- Automatically stages unstaged changes prior to committing
- Supports both short (title only) and long (title and body) commit messages
- Configurable API key and model, stored locally
- Modular TypeScript codebase (see `src/` directory)

## Installation

Install globally via [npm](https://www.npmjs.com/package/commit-now):

```sh
npm install -g commit-now
```

Alternatively, clone the repository and install dependencies using pnpm:

```sh
git clone https://github.com/your-org/commit-now.git
cd commit-now
pnpm install
```

To build for production:

```sh
pnpm run build
```

## Usage

From the project root, execute:

```sh
pnpm start -- [options]
```

If you have built the project to `dist/`:

```sh
node dist/index.js [options]
```

If installed globally:

```sh
cnow [options]
```

### Command-Line Options

- `-s`, `--short` Generate a short commit message (title only)
- `-l`, `--long` Generate a long commit message (title and body)
- `-k`, `--key` Set and save your Lunos API key
- `-m`, `--model` Set and save your preferred model

When using the `-k` or `-m` flags, the configuration is updated and the process exits.

### Example

```sh
cnow -l
```

## Configuration

Configuration is stored in `.config.json` in the same directory as the script (not in the user home directory).

- The API key and model are prompted for on first use, or can be set via CLI flags.
- Obtain your Lunos API key from [https://lunos.tech/dashboard/api-keys](https://lunos.tech/dashboard/api-keys).

## Development

- Source code is located in the `src/` directory, organized by functionality:

  - `src/index.ts` — Main entry point
  - `src/config.ts` — Configuration utilities
  - `src/git.ts` — Git integration utilities
  - `src/lunos.ts` — Lunos API integration
  - `src/cli.ts` — Command-line interface and credential management

- Build output is generated in the `dist/` directory.
- TypeScript is configured with `src/` as the root directory.

## License

This project is licensed under the MIT License.

---

For additional information, please refer to the [npm package page](https://www.npmjs.com/package/commit-now).
