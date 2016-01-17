# More about loaders
In this section we're going to be talking about loaders, pre-loaders, post-loaders and related stuff such as requiring loaders in modules.

## Requiring loaders in modules
As we mentioned at the beginning, we can specify them in modules using `require` statements. To tell [Webpack][1] to transform a module with a loader, we can specify the loader in the module **request**:

```js
var moduleWithOneLoader = require("my-loader!./my-awesome-module");
```

> Notice the `!` syntax used here for separating the **loader** from the **module path**

We have been using some loaders that we installed using [npm][2], but loaders also can be **local files**, in which case they are imported using a **relative path** instead of just the loader name:
```js
require("./loaders/my-loader!./my-awesome-module");
```

Anyways, specifying loaders in each module request can be brittle and repetitive, not to mention the awkward syntax, that's why it's not recommended. It's much better to use the configuration file.

## Babel
[Babel][3] is a JavaScript compiler(aka transpiler) that allows us to use the ES6 syntax now, when is not fully supported by browsers. What Babel does is process our JavaScript using syntax transformers to convert ES6 syntax to ES5. To use Babel in Webpack we need to install 3 things:

* The `babel-core` package contains the core logic of Babel.
* `babel-loader` is the loader that allows us to use Babel in Webpack.
* The `babel-preset-es2015` is the set of Babel plugins to transform ES6, aka **ES2015**.

To install them and have them added to the list of `devDependencies` run:
```
$ npm install babel-loader babel-core babel-preset-es2015 --save-dev
```

Once the packages are installed we have to add some settings to our configuration file:
```js
module: {
  loaders: [
    ... // more loaders here
    {
      test: /\.es6$/,
      exclude: /node_modules/,
      loader: "babel-loader",
      query: {
        presets: ['es2015']
      }
    }
  ]
}
```

* In the `test` property we are specifying that we want to transform files with the `.es6` extension.

* In this case it's very important the `exclude` property, so we can exclude the files in the `node_modules` directory, since we don't want to transform those. This is essential for speeding-up Babel.

* The `query` property allows us to pass **options** to the loader, in this case the preset that we want to use in Babel.

### Passing options as a query string
The same properties we pass in the `query` property can be sent to the loader using a **query string** in the `loader` property, for example:

```js
loader: 'babel?presets[]=react,presets[]=es2015'
```

The query string is appended to the loader name (full or shorthand version) after a `?`. In our example we specified the options in the `query` property since it's more readable.

### Resolving other extensions
Now, since we want to use the `.es6` extension for our ES6 files, we need to add another object to our configuration, so after the `module` property we'll add:
```js
resolve: {
  extensions: ['', '.js', '.es6']
}
```

The reason for this is because, by default, Webpack will process all files with a `.js` extension, and will ignore files without that extension. This is due to the CommonJS feature that allows us to require JavaScript files using only their names, without specifying the `.js` extension. Because of that, Webpack will skip files ending with just the `.es6` extension.

We have to ways to solve this small issue:

* Using the `.es6.js` extension.
* We can also use the `resolve.extensions` property in our Webpack configuration file to make sure that `.es6` files are resolved when they are imported using the require.

Now, if we have a require function call like `require("./somefile")`, webpack will look both for `somefile.js` and `somefile.es6` files.

To try this out we can rename our `.js` files to `.es6` and use some ES6 syntax to check if it works.

## Pre-loaders and post-loaders
After a file is read from the filesystem, loaders are executed against it in the following order.

1. `preLoaders` specified in the **configuration file**.
2. `loaders` specified in the **configuration file**.
3. Loaders specified in the **request** (e.g. require('raw!./file.js'))
4. `postLoaders` specified in the **configuration file**.

In special cases, we can also override the default configuration loader order in the module request:

* Adding `!` to a request will disable configured `preLoaders`:
```js
require("!raw!./script.coffee")
```

* Adding `!!` to a request will disable all `loaders` specified in the configuration:
```js
require("!!raw!./script.coffee")
```


* Adding `!!` to a request will disable configured `preLoaders` and `loaders` but not the `postLoaders`:
```js
require("-!raw!./script.coffee")
```

Next we'll examine an example of how to use [JSHint][4] as a Webpack pre-loader.

## Using jshint as a pre-loader
[JSHint][4] process JavaScript files looking for errors reporting them when they appear. To have JSHint linting our JavaScript files we have to install 2 packages:

* The [jshint][5] package itself.
* The [jshint-loader][6], to use JSHint from Webpack.

```
$ npm install jshint jshint-loader --save-dev
```

Since we want JSHint to process our files before anything else, we are going to add it to our `webpack.config.js` as a pre-loader. So inside our `module` property we'll add the following:
```js
preLoaders: [
  {
    test: /\.(js|es6)$/,
    exclude: /node_modules/,
    loader: 'jshint-loader'
  }
],
```

As you can see, `preLoaders` is an **array of objects**, where each object is a pre-loader. Each pre-loader can use the same keys a loader does.

To try this out change the extension of you JavaScript files to `.es6` and modify the code inside them, for example this is `entry.es6`:
```js
import { message } from './second';
import { sayHi } from './fourth';

console.log(message);

sayHi();

console.log('It works!!');

import './styles/main.css';
import './styles/spiffy.scss';
```

This one is `second.es6`:
```js
export var message = "I'm in second.js";
```

And this one is `fourth.es6`:
```js
export function sayHi() {
  console.log("I'm in fourth.es6");
}
```

Since we're using **ES6** syntax, it's convenient to create a `.jshintrc` file in the root of our project with the following setting:

```json
{
  "esnext": true
}
```

If we restart our development server we should see any linting errors in the console.

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: loaders.md
[next]: #

<!-- links -->
[1]: https://webpack.github.io/
[2]: https://www.npmjs.com/
[3]: https://babeljs.io/
[4]: http://jshint.com/
[5]: https://www.npmjs.com/package/jshint
[6]: https://www.npmjs.com/package/jshint-loader
