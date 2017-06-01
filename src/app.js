const logFactory = require( "./utils/logger" );
const handlers = require( "./handlers" );
const bot = require( "./bot" );

module.exports = ( config, pkg ) => {
	const app = {
		config, pkg, logFactory,
		log: logFactory(),
		start() {
			bot( app )
				.start( handlers )
				.then( () => app.log.info( "Bot started" ) )
				.catch( err => app.kill( err ) );
		},
		stop() {
			app.bot.destroy();
		},
		kill: /* istanbul ignore next */ ( err, msg ) => {
			app.log.fatal( err, msg );
			process.exit( 1 ); // eslint-disable-line no-process-exit
		}
	};

	return app;
};
