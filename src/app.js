const logFactory = require( "./utils/logger" );
const handlers = require( "./handlers" );
const bot = require( "./bot" );
const leankit = require( "./services/leankit" );
const slackHtml = require( "./services/html-to-slack-markdown" );

module.exports = ( config, pkg ) => {
	const app = {
		config, pkg, logFactory,
		log: logFactory(),
		start() {
			bot( app )
				.start( handlers( app ) )
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

	app.leankit = leankit( app );
	app.slackHtml = slackHtml;

	return app;
};
