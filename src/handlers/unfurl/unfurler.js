/* eslint-disable max-lines */
const responsesFactory = require( "./responses" );

module.exports = ( app ) => {
	const { leankit } = app;
	const responses = responsesFactory( app );

	function unfurlCard( log, link ) {
		return leankit( link.subdomain, link.token ).card( link.cardId ).get().then( card => {
			const attachment = link.attachment = responses.card( card );
			log.info( `Unfurled card (${ link.subdomain }/${ link.cardId }): ${ attachment.fallback }` );
			return link;
		} )
		.catch( err => {
			if ( err.statusCode === 403 ) {
				log.info( `No read permissions for card: ${ link.subdomain }/${ link.cardId }` );
				link.attachment = {
					text: `The LeanKit Linker does not have permissions to see that card (${ link.cardId }). Contact your LeanKit administrator if you’d like the board to be visible to all slack users in your organization.`
				};
				return link;
			}

			log.error( `Unable to load card: ${ link.subdomain }/${ link.cardId }`, err.stack );

			return false;
		} );
	}

	function unfurlBoard( log, link ) {
		return leankit( link.subdomain, link.token ).board( link.boardId ).then( board => {
			link.attachment = responses.board( board );

			log.info( `Unfurled board (${ link.subdomain }/${ link.boardId }): ${ link.attachment.fallback }` );

			return link;
		} ).catch( err => {
			if ( err.statusCode === 403 ) {
				log.info( `No read permissions for board: ${ link.subdomain }/${ link.boardId }` );
				link.attachment = {
					text: `The LeanKit Linker does not have permissions to see that board (${ link.boardId }). Contact your LeanKit administrator if you’d like the board to be visible to all slack users in your organization.`
				};
				return link;
			}

			log.error( `Unable to load board: ${ link.subdomain }/${ link.boardId }`, err.stack );

			return false;
		} );
	}

	return function unfurl( log, link ) {
		// TODO: Handle creds correctly and don't do this check
		if ( link.subdomain && link.subdomain !== "banditsoftware" ) {
			log.warn( `Received event for unsupported domain: ${ link.subdomain }` );
			return false;
		}

		if ( "cardId" in link ) {
			return unfurlCard( log, link );
		}

		if ( "boardId" in link ) {
			return unfurlBoard( log, link );
		}

		return false;
	};
};
