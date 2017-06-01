function eventTag( event ) {
	if ( !event ) {
		return "";
	}
	return `(${ event.channel }/${ event.message_ts })`;
}

module.exports = function eventLoggerFactory( event ) {
	function log( method, ...args ) {
		console[ method ]( `[${ Date() }]${ eventTag( event ) }`, ...args ); // eslint-disable-line no-console
	}

	return {
		log: ( ...args ) => log( "log", ...args ),
		info: ( ...args ) => log( "info", ...args ),
		warn: ( ...args ) => log( "warn", ...args ),
		error: ( ...args ) => log( "error", ...args ),
		fatal: ( ...args ) => log( "error", ...args )
	};
};
