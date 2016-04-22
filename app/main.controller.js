export default /*@ngInject */
function MainController($log) {

    let vm = this;

    vm.hello = 'Hello, world';

    $log.log('Here too!');
};