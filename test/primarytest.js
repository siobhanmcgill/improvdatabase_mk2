/* global expect */
define(['jquery', 'underscore', 'app/router'],
    function($, _, Router) {

        describe('default game database view', function() {

            before(function (done) {
                this.timeout(5000);
                setTimeout(done, 2000);
            });

            it('works for app', function() {
                var rout = Router;
                expect(rout).to.be.an('object');
            });

        });

});
