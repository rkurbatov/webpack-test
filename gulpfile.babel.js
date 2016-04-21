import gulp from 'gulp';
import transifex from 'gulp-transifex';

let txClient = transifex.createClient({
    user: 'schoi',
    password: 'translate4fubo',
    project: 'fubotv-website-v2',
    local_path: './translations'
});

let potFileName = './translations/extracted-strings.pot';
//var potFileName = './translations/fubotv-website-v2.pot';

gulp.task('upstream', () => gulp.src(potFileName).pipe(txClient.pushResource()));
gulp.task('downstream', () => gulp.src(potFileName).pipe(txClient.pullResource()));

gulp.task('translate', ['upstream', 'downstream']);
