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

A configuration file is basically a [CommonJS][3] module that we have to export to make it work. For example:

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

Once we have a configuration file in place all we have to do to run Webpack is type:
```
$ webpack --watch
```

And hit `return`, which is much more convenient that having to remember the files involved and whatever options we were using. The configuration we're using is equivalent to the command we run the first time. Notice the `--watch` option we are passing in the command line which is gonna start `webpack` in **watch mode** so every time we make changes to our code base, Webpack will automatically rerun the build an update the output file. There's an equivalent property (`watch: true`) that we can add to our configuration file if we wanted to.

## Running the Webpack Dev Server
The process described in the previous sections works fine for the most basic needs, but one of its inconveniences is that we have to open our HTML files using the **file protocol**, which due to browser security issues, it's gonna make impossible working with front-end frameworks or doing anything useful.

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

The dev server uses Webpack’s **watch mode**. It also prevents Webpack from emitting the resulting files to disk. Instead it keeps and serves the resulting files from memory. This means that you will not see the `webpack-dev-server` build in `bundle.js`, to see and run the build, you must still run the `webpack` command.

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
