# Code Computerlove Ghost CMS theme

The source code for the Code Computerlove [Ghost CMS](https://ghost.org/) theme and the build tasks used to create it.

1. [Before you begin](#1-before-you-begin)
2. [Gulp](#2-gulp)
3. [CSS](#3-styles)
  1. [Setup](#31-setup)
  2. [Project conventions](#32-project-conventions)
  3. [Handling Internet Explorer](#33-handling-internet-explorer)
  4. [Media queries](#34-media-queries)
  5. [Working with colours](#35-working-with-colours)
  6. [Working with units](#36-working-with-units)
  7. [Grid system](#37-grid-system)
  8. [SCSS linting](#38-scss-linting)
4. [JS](#4-js)


##1. Before you begin

**This repository does not include a Ghost installation.** You will need to download and install Ghost in a separate directory. You can then symlink your `_dest` folder to the Ghost themes folder like so:
```
ln -s <path/to/repositories>/code-ghost-theme/_dest/ <path/to/ghost-installation>/content/themes/code-ghost-theme
```

You will need to install [Gulp](http://gulpjs.com/), [Ruby](https://www.ruby-lang.org/en/), and the Ruby gem [Bundler](http://bundler.io/) before you can get started.

When you're ready, run the following commands:

```
bundle install
npm install
```

##2. Gulp

In  `Gulpfile.js`, all project paths are set via the `config` and `paths` variables.
When making alterations use existing variables (or create new ones when necessary) rather than entering a static path.

Development tasks pipe the event to [gulp-livereload](https://github.com/vohof/gulp-livereload) (with the livereload script included in the page locally, preferably using the [LiveReload extension](http://livereload.com/extensions/)).

The gulp file has five tasks:

* `dev` - Development task that compiles and lints all styles, scripts whilst also copying across images. The compiled files are located in `_dest` folder.
* `watch` - Watch task that watches for changes in CSS / JS / HBS files for changes and recompiles and reloads the page.
* `default` - Used by running just `gulp`, this runs the `dev` task followed by the `watch` task - primed for local development.
* `prod` - Production task that is similar to the `dev` task with tweaks for production (concatenates, minifies and inlines inlining CSS/JS files etc). This is run on the CI server and shouldn't need to be used locally unless you're testing.
* `package` - Runs the `prod` task and then zips up the `_dest` folder ready for deployment.

##3. Styles

This project uses [Sass](http://sass-lang.com/), a CSS pre-precessor. Features such as mixins are used throughout the project to help handle varying contexts.

###3.1 Setup

The main file for the project is `main.scss` and should be manually updated with any new file references.

During Gulp SASS compilation, plugins such as [gulp-autoprefixer](https://github.com/sindresorhus/gulp-autoprefixer) and
[gulp-pxrem](https://github.com/gummesson/gulp-pixrem) augment the compiled css.

###3.2 Project conventions

This project follows an [ITCSS](https://speakerdeck.com/dafed/managing-css-projects-with-itcss) methodology.

Name-spaced Block Element Modifier (BEM) format is being used throughout to name class and variable names.
Single hyphens can be used in blocks, elements or modifiers to make names more readable.

```
.o-block__element--modifier {}
.o-block__element--modifier-name{}
```

Following the ITCSS methodology the name-spaces are as follows:

```
.o- /* objects */
.c- /* components */
.u- /* trumps (or utility classes) */
```

File names should match class names, so future devs can find source code more easily. E.g. `.o-block`  will be found in `_objects.block.scss`.

####Nesting

**DON'T**. One class should not depend on another. Classes should be portable without needing specific parents or grandparents. Specificity is also kept as low as possible this way.

Wrong:

```
.o-block {
    .o-block__element {}
}
```
Right:
```
.o-block {}
    .o-block__element {}
```
Use indenting to help give structure to related classes.

Only use nesting for pseudo elements and states such as `:before` and `:hover`, where you need to override a class based upon a dependancy or if you are using a BEM modifier to apply modified styles.

Acceptable:

```
.o-block {
    &:hover {}
    .no-js & {}
}

.o-block--modifier {
    .block__title {}
}
```

####Elements

Elements are like children, they deserve names. Unless an element is truly generic and uses a global style, give it a name.

> "Your selectors should be as explicit as your reason for wanting to select something."
> — *[Harry Roberts](http://csswizardry.com/2012/10/a-classless-class-on-using-more-classes-in-your-html/)*

Wrong:
```
.block {
    h1 {}
}
```

Right:

```
.block {}
    .block__title {}
```

####Sibling and child selectors

It's OK to select an element using `:first-child` or `+` etc if it's necessary and appropriate. Think about the use case. Will the target always be the first child? What if it moves?

####Extend

**DON'T**. Extending creates relationships between rules based on shared traits that are purely coincidental. It makes it difficult to inspect an element and can disguise how bloated your rules are. **USE A MIXIN INSTEAD**.

Learn more:

> [When to use @extend; when to use a mixin](http://csswizardry.com/2014/11/when-to-use-extend-when-to-use-a-mixin/) [Harry Roberts]
> [Sass: Mixin or Placeholder?](http://www.sitepoint.com/sass-mixin-placeholder/) [Hugo Giraudel]


###3.3 Handling Internet Explorer

We're currently supporting IE9+, but optimising for Edge.

###3.4 Media queries

Media queries are managed using mixins and using defined breakpoint SASS variables. A map of breakpoints can be found in `_settings.breakpoints.scss`.

The three mixins to handle media queries are:

```
@include respond-min(sm) {
    //styles applied to screens fitting width of sm and up
}

@include respond-max(md) {
    //styles applied to screens fitting width of md and down
}

@include respond-min-max(sm, lg) {
    //styles applied to screen that width fit between md and lg
}
```

###3.5 Working with colours

A list of all the colours can be found in `_settings.colors.scss`. Colour variables should not be accessed directly, but through the `get-color` function via the `$color-uses` map. E.g.

```
color: get-color(primary); // primary => code-blue => #1f2040
```

Optionally, you can lighten or darken using the get-color function. E.g.

```
color: get-color(primary, lighten, 20%);
```


###3.6 Working with units

When setting the dimensions of something in the styles, there is a SASS function to set the dimension using relative EMs (REMs) from a pixel measurement. E.g.

```
font-size: rem(16px);
```

The root HTML element has a REM size set, which changes at the `sm`, `md` and `lg` breakpoints. You can find these sizes in `_settings.breakpoints.scss` or use the `get-rem-size(sm)` function.

[gulp-pxrem](https://github.com/gummesson/gulp-pixrem) handles adding a pixel fallback during css compilation.

###3.7 Grid system

The grid code is generated by a Sass mixin, in `_trumps.widths.scss`. Columns are set per breakpoint, as required.

Column widths are expressed as fractions. Examples are: `.u-1/2`, `.u-1/3` and `.u-1/4`.  Column classes can be overridden per screen size, using the `@md` and `@lg` modifiers.

To float columns, use a container with `.o-layout` and then either `o-layout__left` or `o-layout__right`.

Example:
```
<div class="o-layout">
    <div class="o-layout__left u-1/2">...</div>
    <div class="o-layout__left u-1/2@md">...</div>
    <div class="o-layout__left u-1/2 u-1/4@lg">...</div>
</div>
```

###3.8 SCSS linting

This project uses SCSS Linting to help enforce BEM standards and maintain code quality. SCSSLinting is run during `gulp dev` and `gulp prod`. It is not ran as part of `gulp watch` due to the long time it takes to complete. You can use the [Sublime Text 3 package](https://github.com/attenzione/SublimeLinter-scss-lint) or a similar Atom package to catch warnings and errors during development.

The linting rules can be found in the `.scss-lint.yml`.

Linting errors are displayed in the command line output.


##4. JS
This project uses vanilla JS rather than jQuery. Javascript that does not come from a vendor should be put in `js\app.js`.

All JS files are concatenated (and minified then inlined for production) into a single file. Linting is done using [gulp-jshint](https://github.com/spalger/gulp-jshint).

A gulp `scripts:lint` task is also ran as part of `gulp dev` and `gulp prod`. Use the [Sublime Text 3 package](https://github.com/attenzione/SublimeLinter-jshint) or a similar Atom package to catch warnings and errors during development.

Warning counts are displayed in the command line output.
