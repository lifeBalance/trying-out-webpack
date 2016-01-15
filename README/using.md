# Using Webpack
Now that we know how to install and setup a project, as well as how to run it from the command line,  in this section we're gonna start learning more productive ways to work with [Webpack][1].

We have available a number of options to use with the `webpack` in the command line, to see a full list run:
```
$ webpack --help
```

In the last section we used the command in its most basic form:

```
$ webpack <entry> <output>
```

* Where `<entry>` is a file (the entry point of our application) or a request string. We can pass multiple entries.
* And `<output>` is the output file.

All of the arguments we can use in the command line, map to **configuration options** that we can use in a configuration file. [Click here][2] for a detailed list of options.

## Adding a configuration file
The set of options we can pass to `webpack` for a given build can become pretty long, to the point that is not viable to specify them in the command line. That's why is necessary to write them down in a configuration file. This file has to be named `webpack.config.js` and be placed in the same directory where we run the command. This way our build will run with all the configuration settings specified in the file.

> A lot of the options we can use in the command line map to a configuration option.

We don’t need to write pure JSON into the **configuration file**, it's just a JavaScript object that we export as a [CommonJS][3] module. For example:

```js
module.exports = {
  entry: './entry.js',
  output: {
    filename: 'bundle.js'
  }
}
```

> Don't forget to specify the relative path using `./entry.js`; using just `entry.js` will throw:
>
> `ERROR in Entry module not found: Error: Cannot resolve module 'entry.js'`

The settings we're using above are equivalent to the options we passed to the command we run the first time, we are just specifying an **entry point** and an **output file**. But it's better to set these options in a file so all we have to do to run Webpack is type:
```
$ webpack
```

And hit `return`, which is much more convenient that having to remember the files involved and whatever options we were using.

## Watching mode
Passing the `--watch` option in the command line starts `webpack` in **watch mode**, so every time we make changes to our code base, Webpack will automatically rerun the build an update the output file:
```
$ webpack --watch
```

There's an equivalent property (`watch: true`) that we can add to our configuration file if we wanted to.

## Running the Webpack Dev Server
The process described in the previous section works fine for the most basic needs, but one of its inconveniences is that we have to open our HTML files using the **file protocol**, which due to browser security issues, it's gonna make impossible working with front-end frameworks or doing anything useful.

So we need to serve our app using the **HTTP protocol**. Even though we could use our own server, the **Webpack** team has created a small server made with [Express][4] and called [webpack-dev-server][5]. This server uses a special [webpack-dev-middleware][6] to serve the generated webpack bundle, and emits information about the compilation state to the client, which reacts to those events.

To install it:
```
$ npm i webpack-dev-server -g
```

Once the server is installed we can start it up from the root of our project running:
```
$ webpack-dev-server
http://localhost:8080/webpack-dev-server/
webpack result is served from /
content is served from /Users/javi/CODE/JS/WEBPACK/trying-out-webpack
Hash: 396f0bfb9d565b6f60f0
Version: webpack 1.12.10
Time: 68ms
```

If we point our browser to http://localhost:8080/webpack-dev-server/ we should have our app running, with a sort of status bar at the top which reads **App ready**. When working this way, our app is served in an **iframe** element, right under the mentioned status bar. One awesome built-in feature of the server running this way is **hot-loading**: for every change made to our entry point, the browser refreshes automatically.

> The livereload only works for our JavaScript files, not HTML or other stuff.

If we want to get rid of the **App ready** bar, we just have to point our browser to http://localhost:8080/, but the **livereloading** will be gone. To fix that we just have to start the server with the `--inline` option. (We cannot specify it in our configuration file)

At this point could be a good idea to add a couple of new lines to the `scripts` section of our `package.json` file:

```json
"serve": "webpack-dev-server",
"inline": "webpack-dev-server --inline"
```

We can run any of these preceding them with `npm run`, for example to start the server with the `--inline` option we would run:

```
$ npm run inline
```

The dev server uses Webpack’s **watch mode**. It also prevents Webpack from emitting the resulting files to disk. Instead it keeps and serves the resulting files from memory. This means that you will not see the `webpack-dev-server` build in `bundle.js`, to see and run the build, you must still run the `webpack` command.

## Organizing our project
So far we have all our files sitting at the root of our project, which is fine at this point since the project is really small. But once it starts growing, having everything in the same place is going to become a mess. This is what we have so far:

```
.
├── index.html
├── entry.js
├── second.js
├── third.js
├── bundle.js
├── webpack.config.js
├── node_modules/
└── package.json
```

We're going to create some subdirectories (`app`, `build` and `public`) at the root of our project to help organize everything, like this:
```
.
├── app
│   ├── entry.js
│   ├── second.js
│   └── third.js
├── build
│   └── js
│       └── bundle.js
├── public
│   ├── index.html
│   └── assets/
│       └── js/
├── webpack.config.js
├── package.json
└── node_modules/
```

* In the `app` folder we've put our JavaScript source code.

* We have to adjust Webpack so that during **development** it outputs the results of our builds in the `build` folder, which by the way it's going to be added to our `.gitignore`.

* In the `public` folder we're going to put just the `index.html`. When the time comes to build for **production**, an assets folder will be generated with subdirectories for the different type of assets that our application is gonna need. At the moment, if we build it will have just a `js` folder for our `bundle.js`.

Since we are going to be building our files in two different places:

* In the `build` folder when **developing**.
* In the `public/assets` directory when we are ready for **production**.

The question is, where do we point our HTML file? The answer is to always point to the **production** directory and then, use some trickery in our configuration file so we don't have to change the `<script>` tag when we are in **development**. Let's see how:

```js
var path = require("path");

module.exports = {
  context: path.resolve('app'),
  entry: './entry',
  output: {
    path: path.resolve('build/js'),
    filename: 'bundle.js',
    publicPath: path.resolve('/public/assets/js')
  },
  devServer: {
    contentBase: 'public'
  }
}
```

* First of all we are importing the `path` module ([Node.js core][7]), so we can use the `resolve` method. This method takes in several strings and returns an **absolute path**.

* The `context` property sets the base directory (absolute path!) for resolving the `entry` option. In our project we are keeping all the source files in the `app` folder.

* The `output.path` is the absolute path to the output directory and `filename` is self explanatory. Only when we run the `webpack` command using the **development** configuration (default), the files will be generated in this location.

* The `output.publicPath` is the interesting part here, it specifies the **public URL address** of the output files when referenced in a browser. So when we are in **development**, every request for the build assets that is received by the `webpack-dev-server` is resolved to this location, even though the files are not actually served from there; as we mentioned before, the `webpack-dev-server` serves the build virtually, from memory.

* After the initial configuration we have added another property named `devServer.contentBase` so when someone requests `index.html` from the root, it's gonna be served from the `public` directory, in this case where the file actually lives.

Let's run the server to check everything is working properly:
```
$ npm run serve
```

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: install.md
[next]: #

<!-- links -->
[1]: http://webpack.github.io/
[2]: https://webpack.github.io/docs/cli.html
[3]: http://www.commonjs.org/
[4]: http://expressjs.com/
[5]: https://webpack.github.io/docs/webpack-dev-server.html
[6]: https://webpack.github.io/docs/webpack-dev-middleware.html
[7]: https://nodejs.org/api/path.html
