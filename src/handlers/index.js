/* eslint-disable global-require */
module.exports = ( app ) => {
	return {
		init() {
			[ require( "./unfurl" ) ].forEach( factory => {
				factory( app );
			} );
		}
	};
};
