Gulp Workflow
======================
A basic gulp workflow to compile sass, add vendor prefixes, minify css & javascript and live reload with browser sync.

## Usage

1. Clone this repository

        $ git clone https://github.com/davidlpz/gulp-workflow.git

2. Change the directory to the application folder

        $ cd gulp-workflow

3. Start a new project

        $ npm init

4. Install the dependencies

        $ npm install gulp gulp-autoprefixer gulp-clean-css gulp-sass jshint gulp-jshint gulp-uglify browser-sync gulp-concat gulp-rename --save-dev

5. Run the `default` task

        $ gulp default