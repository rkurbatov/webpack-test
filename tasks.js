require('babel-register')({
    presets: ['es2015']
});

switch (process.argv[2]) {
    case 'translations-load':
        return require("./tasks/translations-load");
    default:
        console.info('No task specified!');
}