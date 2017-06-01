const cardResponse = require( "./card" );
const boardResponse = require( "./board" );

module.exports = ( app ) => {
	return {
		card: cardResponse( app ),
		board: boardResponse( app )
	};
};
