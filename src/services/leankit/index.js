const request = require( "request-promise" );

module.exports = ( { config } ) => {
	return ( subdomain, token ) => ( {
		card: ( cardId ) => ( {
			get() {
				return request.get( `https://${ subdomain }.leankit.com/io/card/${ cardId }`, {
					auth: { bearer: token },
					json: true
				} ).then( card => {
					return Object.assign( card, { subdomain, cardId } );
				} );
			}
		} ),
		board: ( boardId ) => ( {
			get() {
				return request.get( `https://${ subdomain }.leankit.com/io/board/${ boardId }`, {
					qs: {
						omit: "users,userSettings,cardTypes,classesOfService,laneClassTypes,lanes,laneTypes,tags,customFields,priorities"
					},
					auth: { bearer: token },
					json: true
				} ).then( board => {
					return Object.assign( board, { subdomain, boardId } );
				} );
			}
		} )
	} );
};
