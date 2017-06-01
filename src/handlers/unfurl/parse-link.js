const PARSE_BOARD = /^https?:\/\/(.*?)\.leankit\.com\/(?:Boards\/View|board)\/(\d+)/;
const PARSE_CARD = /^https?:\/\/(.*?)\.leankit\.com\/(?:Boards\/View\/\d+(?:\/\d+)?|card)\/(\d+)/;

module.exports = function parseLink( link ) {
	const cardTokens = link.url.match( PARSE_CARD );
	if ( cardTokens ) {
		link.subdomain = cardTokens[ 1 ];
		link.cardId = cardTokens[ 2 ];
		return link;
	}

	const boardTokens = link.url.match( PARSE_BOARD );
	if ( boardTokens ) {
		link.subdomain = boardTokens[ 1 ];
		link.boardId = boardTokens[ 2 ];
	}

	return link;
};
