## Vite Mimo

Vite with multiple CSS and JS files

This is an exploration on how to get Vite to work with multiple inputs and multiple outputs.

```bash
npm install
npm run build
```

## why?

I have an application that hosts multiple websites, each with their own CSS file. This is handy for traditional server apps - Express, Laravel, Ruby on Rails, etc..

## Using

Put all your targets/entry points into the `index.html` file, like so. The file is not meant to be viewed, but serve as a single entry point for the vite dev server so you can still run a single `vite` command.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="./styles/one.styl" />
    <link rel="stylesheet" href="./styles/two.css" />
    <link rel="stylesheet" href="./styles/three.scss" />
  </head>
  <body>
    <script type="module" src="./scripts/scripts.js"></script>
    <script type="module" src="./scripts/backend.js"></script>
    <script type="module" src="./scripts/viewer.js"></script>
  </body>
</html>
```

## Dev

The Running `vite` will spin up the dev server. You then will need to manually include the `/@vite/client` js into your application while in development mode, as well as any assets you'd like to be live reloaded. See the [vite docs](https://vitejs.dev/guide/backend-integration.html) for more on this.

## Building

The `build.js` script will crawl your `index.html` for all scripts and stylesheets and then pass each of those to the rollup config via the [input](https://rollupjs.org/configuration-options/#input) option.
