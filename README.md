# INM320 CSS Precompiler

The page stylesheet is maintained in Sass and compiled to
`public/assets/css/style.css`.

## Setup

```sh
npm install
npm run build
```

## Development

Run the Sass watcher and local static server together:

```sh
npm run dev
```

Open <http://localhost:3000> to view the page. `npm run build` compiles the
stylesheet once; `npm run watch:css` keeps it up to date while editing.
