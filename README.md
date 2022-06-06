[![Deploy](https://github.com/AgileProggers/archiv-frontend/actions/workflows/deploy.yml/badge.svg?branch=master)](https://github.com/AgileProggers/archiv-frontend/actions/workflows/deploy.yml)

## Developing

Copy [.env.example](.env.example) to `.env`.

Install dependencies with `pnpm install` (or `npm install` or `yarn`), start a development server:

```bash
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Building

To create a production version of your app:

```bash
pnpm run build
```

You can preview the production build with `pnpm run preview`.
