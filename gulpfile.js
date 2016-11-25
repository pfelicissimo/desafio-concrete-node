const gulp = require('gulp')
const mocha = require('gulp-mocha')
const eslint = require('gulp-eslint')
const spawn = require('child_process').spawn

let node

gulp.task('test', ['lint'], cb => gulp.src(['test/**/*.js'], { read: false })
  .pipe(mocha({
    reporter: 'spec',
    require: 'test/helpers.js',
  }))
  .once('error', (err) => {
    process.exit(1)
    cb(err)
  }))


gulp.task('lint', () =>
  gulp.src(['**/*.js', '!node_modules/**'])
  .pipe(eslint())
  .pipe(eslint.format())
)

gulp.task('server', () => {
  if (node) node.kill()
  node = spawn('node', ['server.js'], {
    stdio: 'inherit',
  })
  node.on('close', (code) => {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...')
    }
  })
})


gulp.task('default', ['lint', 'test'], () => {
  gulp.start('server')
})
