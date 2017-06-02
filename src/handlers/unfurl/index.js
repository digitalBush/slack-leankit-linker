const { WebClient } = require( "@slack/client" );
const parseLink = require( "./parse-link" );
const unfurler = require( "./unfurler" );

function linkCount( links ) {
	return `${ links.length } link${ links.length !== 1 ? "s" : "" }`;
}

module.exports = ( app ) => {
	const { slapp, logFactory, config } = app;
	const unfurl = unfurler( app );

	function getToken( msg ) {
		// Pull from config first, then try the metadata for the team as defined in BeepBoop
		return config.leankitApiToken || msg.meta.config.LEANKIT_API_TOKEN;
	}

	slapp.event( "link_shared", msg => {
		const { event } = msg.body;
		const token = getToken( msg );
		const eventLog = logFactory( event );
		eventLog.info( `New "link_shared" event: ${ linkCount( event.links ) }` );

		Promise.all( event.links
			.map( parseLink ) // Extract domain and board/card ids from links
			.map( link => Object.assign( link, { token } ) )
			.map( link => unfurl( eventLog, link ) ) // Generate unfurl attachments for each link
		)
		.then( links => links.filter( Boolean ) )
		.then( links => {
			if ( !links.length ) {
				eventLog.info( "Nothing to unfurl!" );
				return null;
			}

			const unfurls = links.reduce( ( _unfurls, link ) => {
				_unfurls[ link.url ] = link.attachment;
				return _unfurls;
			}, {} );

			const slack = new WebClient( msg.meta.app_token );
			return slack.chat.unfurl( event.message_ts, event.channel, unfurls ).then( result => {
				eventLog.info( `Successful Unfurling: ${ linkCount( links ) }` );
			} );
		} ).catch( err => {
			eventLog.error( "CAUGHT ERROR:", err.stack || err.message || err );
		} );
	} );
};
