import MainCtrl from './main.controller';

export default angular
    .module('testApp', [])
    .run(($log) => {
        $log.log(moment());
    })
    .controller('MainController', MainCtrl);
