# Installing Webpack
Since [Webpack][1] is distributed as an [npm][2] package, we can install it **globally** and have it available as a command in any of our projects running:

```
$ npm install webpack -g
```

As we'll see in a minute, installing Webpack globally is **optional**.

## Setting up a project
We're going to start creating an empty directory for a project, and from there generating a `package.json` file using npm:

```
$ mkdir trying-out-webpack
$ cd trying-out-webpack
$ npm init -y
```

Now, with a `package.json` in place, let's install Webpack **locally** and add it to our list of `devDependencies`:
```
$ npm install webpack --save-dev
```

This way we'll be using the local version of webpack and not the single global one, what allows for using a different version of webpack in each of our projects. As a matter of fact, it's not necessary to install webpack **globally**, we can do it just locally and add the following line to the `scripts` section of your `package.json` file:
```js
"build": "webpack"
```

Now we can run `npm run build` everytime we wanted to run the `webpack` command. This is specially useful when we want to add some command-line options to `webpack`, and alias them to something.

### Adding some files
Let's create one basic **HTML file** with this content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Trying-out Webpack</title>
</head>
<body>
  <h1>Trying-out Webpack</h1>

  <script type="text/javascript" src="bundle.js" charset="utf-8"></script>
</body>
</html>
```

And a simple **JavaScript file** named `entry.js`:
```js
console.log('It works!!');
```

## Working with Webpack
There are several ways of using **Webpack**:

* As a **CLI** application.
* Using a development server.

### Webpack CLI
Once installed we just have to navigate to our directory project and run the `webpack` command:
```
$ webpack entry.js bundle.js
Hash: c4fc739f954fdeb994d2
Version: webpack 1.12.11
Time: 59ms
    Asset     Size  Chunks             Chunk Names
bundle.js  1.42 kB       0  [emitted]  main
   [0] ./entry.js 27 bytes {0} [built]
```

This command takes 2 arguments:

* An **input file**, in this case `entry.js`
* An **output file**, which is typically named `bundle.js`

From the output we can see several things: a **hash** number, the webpack **version** and more importantly that a new asset named `bundle.js` with a **size** of 1.42 kB has been generated, and that the process took 59ms.

### Adding a second script
So far we're not doing anything remarkable with webpack. Let's add a second JavaScript file (named `second.js`) and export a module using [CommonJS][3] syntax:

```js
module.exports = "I'm in second.js";
```

Now let's import this file from the entry point or our application (`entry.js`):

```js
var message = require('./second');
console.log(message);

console.log('It works!!');
```

We'll have to build again:
```
$ npm run webpack entry.js bundle.js
```

Open `index.html` in your browser and from the developer tools open the JavaScript console, the two messages should appear. Note that if we try to access the variable `message` in the browser console, we get an `Uncaught ReferenceError: message is not defined`, this is because using modules, variables are not added to the **global namespace**.

If we had used a script tags to import this dependency, we would have ended with `message` polluting the global namespace, and thus accessible in the console by just typing `message`. You can try this out creating a file named `third.js` and defining inside the variable:

```js
var message = "I'm in third.js";
```

Add the following script tag to your `index.html` file:
```html
<script type="text/javascript" src="third.js" charset="utf-8"></script>
```

Refresh the page in the browser and try to access the variable `message` again. All the stuff defined at the top-level of a script added using a `script` tag, ends up in the global namespace. A module system avoids polluting the global environment.

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: what-is.md
[next]: using.md


<!-- links -->
[1]: http://webpack.github.io/
[2]: https://github.com/npm/npm
[3]: http://www.commonjs.org/
