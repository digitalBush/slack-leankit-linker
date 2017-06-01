const { WebClient } = require( "@slack/client" );
const parseLink = require( "./parse-link" );
const unfurl = require( "./unfurler" );

function linkCount( links ) {
	return `${ links.length } link${ links.length !== 1 ? "s" : "" }`;
}

module.exports = ( { slapp, log, logFactory } ) => {
	slapp.event( "link_shared", msg => {
		const { event } = msg;
		const eventLog = logFactory( event );
		eventLog.info( `New "link_shared" event: ${ linkCount( event.links ) }` );

		Promise.all( event.links
			.map( parseLink ) // Extract domain and board/card ids from links
			.map( link => unfurl( eventLog, link ) ) // Generate unfurl attachments for each link
			.filter( Boolean ) // Remove links we can't unfurl
		).then( links => {
			if ( !links.length ) {
				eventLog.info( "Nothing to unfurl!" );
				return null;
			}

			const unfurls = links.reduce( ( _unfurls, link ) => {
				_unfurls[ link.url ] = link.attachment;
				return _unfurls;
			}, {} );

			const slack = new WebClient( msg.meta.bot_token || msg.meta.app_token );
			return slack.chat.unfurl( event.message_ts, event.channel, unfurls ).then( result => {
				eventLog.info( `Successful Unfurling: ${ linkCount( links ) }` );
			} );
		} ).catch( err => {
			eventLog.error( "CAUGHT ERROR:", err.stack || err.message || err );
		} );
	} );
};
