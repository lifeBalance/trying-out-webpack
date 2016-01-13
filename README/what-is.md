# Webpack
[Webpack][1] is mainly a **module bundler**, meaning that it takes a bunch of JavaScript modules that live in separate files and combines them into one or several individual files known as bundles.

So instead of having to deal with dependencies and the order in which they are required like this:

```html
<script src="module1.js"></script>
<script src="module2.js"></script>
<script src="libraryA.js"></script>
<script src="libraryB.js"></script>
```

Webpack takes care of it for us. In big projects the list of dependencies can get really long and difficult to manage. Using a module system we deal with dependencies inside each file reducing maintenance costs of large JavaScript apps.

## Supported module systems
**Webpack** works fine with the three major module systems:

* [CommonJS][2], natively.
* [RequireJS][3], natively.
* [ES6 modules][4], using a loader.

Using any of these systems we just have to worry about the dependencies that the code inside a module (generally a separate file) has, and list them at the top of the file.

## Other useful stuff
Apart from dealing with modules, **Webpack** also helps with other tasks such as:

* Minification of static assets.
* Stylesheets.
* Images.
* Web fonts.
* Templates for HTML.
* Transpilation of several languages (Coffeescript, TypeScript, ES6) to JavaScript.
* Linting errors.

As we can see Webpack works not just as a module manager but as a generic build process tool, in the line of task runners such as [Grunt][5] or [Gulp][6].


---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: ../README.md
[next]: #

<!-- links -->
[1]: http://webpack.github.io/
[2]: http://www.commonjs.org/
[3]: http://requirejs.org/
[4]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
[5]: http://gruntjs.com/
[6]: http://gulpjs.com/
