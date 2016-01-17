# Loaders
By default **Webpack** just process our JavaScript files combining and minifying them, but apart from that, it doesn't do anything else. **Loaders** allow us to add new functionality to **Webpack**. They are just functions running in Node.js, that take source files as arguments and transform them in some way, for example when converting CoffeeScript to JavaScript. Sometimes, like for example when using linters, these files are not transformed at all.

There are loaders for a lot of tasks, check the [Webpack's site][1] for a list of them. They're easily recognizable because, by convention though not required, their names have the `-loader` suffix.

## Loading CSS into our Build
Webpack allows us to embed our stylesheets in our bundle, as if they were modules. Yes, importing CSS into JavaScript files looks weird at first. In order to do that we have to install two different loaders:

* The [css-loader][2]  go through our CSS files looking for `url()` statements and resolving them.
* The [style-loader][3] inserts the CSS into `<style>` tagS on our HTML files.

> Loaders are distributed as [npm][4] and can be installed using the `npm` command.

```
$ npm install css-loader style-loader --save-dev
```

### Using loaders
Once a loader is installed, we may reference it using its **full name**, including the `-loader` suffix, for example `css-loader`, or using its **shorthand name**, which is formed by taking away the mentioned suffix, for example, `css`.

We have three ways of using loaders in our app:

* We can specify them in `require` statements, which is not recommended.
* They can be passed as arguments in the **command line**, not very practical.
* The best and recommended way is to add them to our **configuration file**.

Let's take the recommended way and add the loaders to our configuration:
```js
module: {
  loaders: [
    {
      test: /\.css$/,
      exclude: /node_modules/,
      loader: 'style-loader!css-loader'
    }
  ]
}
```
* First of all we create a `module` object to hold the loaders. This property will contain the options affecting modules, which is what loaders are.
* The `loaders` key contains an **array of loaders**, where each individual loader goes in a separate object.
* Each loader object will specify its own properties, the most important ones being:

  * The `test` property takes a **regular expression** that refers to the file extension of the files the loader is gonna be acting on.
  * The `exclude` property also takes a **regex** to exclude certain files or directories from the reach of the loader.
  * The `loader` key takes a **string** which refers to the loader itself; we can refer to the loader using its full name as well as its shorthand name. This property deserves separate mention.

### The loader string
We must mention a few things about this string:

#### Chaining loaders
Loaders can be chained together in the same string, separating them with a `!`. Note that when we chain loaders this way, they are **applied right to left**. This is helpful for applying multiple transformations to a file in a pipeline. So in our example, `.css` files are gonna be processed:

1. First through the `css-loader`
2. After through the `style-loader`

> Separate chained loaders with an **exclamation mark** (`!`)

We could specify a particular file at the end of the string. In this case is not necessary since we are targeting all `.css` files in the `test` property.

### Requiring the CSS modules in our JavaScript modules
With this configuration in place, all we need to do is import these files into our application using `require()` statements inside our JavaScript modules. But first let's create a simple stylesheet named `main.css` inside the `app/styles` folder:

```css
body {
  background-color: grey;
}
```

And then let's include it in our **entry point** (`entry.js`):
```
require('./styles/main.css');
```

Note that we don't use `<link>` tags in our HTML file to include our `.css` files, instead Webpack inserts the CSS code in our HTML page using `<style>` tags, so the browser doesn't have to make separate requests to the server for each of the stylesheets. You can check this by opening your browser's developer tools, and look in the `<head>` element for the styles added by Webpack inside the `<style>` tag.

## The Sass Loader
If we prefer to write our stylesheets using [Sass][5], we have to install the [sass-loader][6]:
```
$ npm install sass-loader node-sass --save-dev
```

> Note we are also installing [node-sass][7] as it is a [peerDependency][8] of the `sass-loader`. npm **versions 1 and 2** used to automatically install `peerDependencies` what was frequently confusing and sometimes led to dependency hell. In **version 3**, we would receive a warning that the peerDependency is not installed instead.

Now we have to add the new loader to our `webpack.config.js`:
```js
module: {
  loaders: [
    {
      // css and style loaders here
    },
    {
      test: /\.scss$/,
      exclude: /node_modules/,
      loader: 'style-loader!css-loader!sass-loader'
    }
  ]
}
```

Remember, when chaining loaders, they are applied **right to left**. In the above example, `.scss` files will be transformed first by the `sass-loader` converting them to css, and then passed to the `css-loader` where urls, fonts, and other resources are processed, and then finally passed to `style-loader` to be transformed into a `<style>` tag.

To try out the configuration let's create a new stylesheet using **Sass** syntax, name it `spiffy.scss`:

```sass
$green: #A7E22E;

body {
  color: $green;
}
```

And let's import the stylesheet into our entry point:
```js
require('./styles/spiffy.scss');
```

Boot up the server to test it out.

## Autoprefixer
Sometimes, browser manufacturers (vendors) can’t wait, and decide to implement CSS properties that haven’t reached the final **Recommendation** status. They do it using special prefixes, to make clear that it’s just a particular interpretation of the specification, not the official one, since it doesn’t exist yet. Other vendors may decide to implement it in a different way. Once the specification stabilize the prefixes are dropped, and we shouldn’t be using them in our stylesheets.

But having to manually add prefixes to our stylesheets is a tedious and error prone work, since we have to be paying attention to sites such as [css3please.com][9] or [caniuse.com][10]. Fortunately we don't need to do that anymore thanks to [Autoprefixer][11], which takes care of autoprefixing our CSS for us.

To make use of Autoprefixer we need to install [PostCSS][12], which is a tool for transforming styles with JS plugins, being Autoprefixer one of those plugins. The Webpack loader for PostCSS as well as the Autoprefixer plugin can be installed running:
```
$ npm install postcss-loader autoprefixer --save-dev  
```

Once both pieces have been installed we have to require and configure them in `webpack.config.js`:
```js
var path = require("path");
var autoprefixer = require("autoprefixer");

module.exports = {
  ... // some stuff here
  module: {
    loaders: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: 'style-loader!css-loader!postcss-loader'
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loader: 'style-loader!css-loader!postcss-loader!sass-loader'
      }
    ]
  },
  postcss: function () {
    return [autoprefixer];
  }
};
```

To try it out let's add a couple of CSS rules, one in the `spiffy.scss` file:
```css
.box {
  background: linear-gradient(135deg, red, blue);
}
```

And another one in the `main.css` file:
```css
body {
  background-color: grey;
  display: flex;
}
```

Both properties, linear-gradients and flexbox need prefixing. Start the server in **inline mode** or  just point the browser to [http://localhost:8080][]. If we check the style tags, we should see the prefixes added by Autoprefixer.

## A Separate CSS Bundle
We may want Webpack to create a separate CSS bundle instead of being embedded inside our HTML. To do that we're going to need a **plugin** named [extract-text-webpack-plugin][13]:
```
$ npm install extract-text-webpack-plugin --save
```

Once installed, we have to require the plugin in our `webpack.config.js`:
```js
...
var ExtractTextPlugin = require('extract-text-webpack-plugin');

output: {
  path: path.resolve('build/'),
  publicPath: '/public/assets/',
  filename: 'bundle.js'
},
...

plugins: [
  new ExtractTextPlugin('styles.css')
]
...
module: {
  loaders: [
    {
      test: /\.css$/,
      exclude: /node_modules/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader')
    },
    {
      test: /\.scss$/,
      exclude: /node_modules/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!sass-loader')
    }
  ]
}
```

* Since we are going to build a bundle for our JavaScript and another one for our CSS, we've changed a couple of things inside the `output` property:

  * The `output.path` now points to `/build/`. Both styles and JavaScript files will be build here.
  * The `output.publicPath` now points to `/public/assets/`.

* In the new `plugins` property we're calling the `ExtractTextPlugin` function passing the name we want for our CSS bundle, in this case `styles.css`.
* In the loader we have also change the `loader` property to make use of the `extract` method, where we are passing two arguments:

  1. The first argument is optional (`'style-loader'`) and is the loader(s) that should be used when the css is not extracted (i.e. in an additional chunk when `allChunks: false`)
  2. The second one is just the loader string to process the styles before they're put in the separate bundle.

Now that we're going to be using a separate bundle for our styles we need to add a `<link>` tag in our HTML:
```html
<link rel="stylesheet" href="/public/assets/styles.css">
```

And also we need to update the `<script>` tag that points to our `bundle.js`:
```html
<script type="text/javascript" src="/public/assets/bundle.js" charset="utf-8"></script>
```

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: using.md
[next]: #

<!-- links -->
[1]: https://webpack.github.io/docs/list-of-loaders.html
[2]: https://github.com/webpack/css-loader
[3]: https://github.com/webpack/style-loader
[4]: https://www.npmjs.com/
[5]: http://sass-lang.com/
[6]: https://github.com/jtangelder/sass-loader
[7]: https://github.com/sass/node-sass
[8]: https://docs.npmjs.com/files/package.json#peerdependencies
[9]: http://css3please.com/
[10]: http://caniuse.com/
[11]: https://github.com/postcss/autoprefixer
[12]: https://github.com/postcss
[13]: https://github.com/webpack/extract-text-webpack-plugin
