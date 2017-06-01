let localConfig = {};
try {
	localConfig = require( "../../config.local" ); // eslint-disable-line global-require
} catch ( e ) {
	// No local config
}

module.exports = Object.assign( {
	port: process.env.PORT || 4390,
	slackVerificationToken: process.env.SLACK_VERIFY_TOKEN,

	// TODO: Implement an Add to Slack button in LeanKit to support looking this up per team
	leankitApiToken: process.env.LEANKIT_API_TOKEN
}, localConfig );
