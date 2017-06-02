/* eslint-disable max-lines */

module.exports = ( { leankit, slackHtml } ) => {
	return function buildCardRepresentation( card ) {
		const attachment = {
			title_link: `https://${ card.subdomain }.leankit.com/card/${ card.cardId }`,
			title: `${ card.type.title }: ${ card.title }`,
			fallback: `${ card.board.title } > ${ card.lane.title } > ${ card.type.title }: ${ card.title }`,
			text: card.description && slackHtml( card.description ),
			color: card.color, // card.blockedStatus.isBlocked ? "danger" : "good", // "warning" "danger" "#ff00ff"
			fields: [ {
				title: "On Board",
				value: card.board.title,
				short: true
			}, {
				title: "In Lane",
				value: card.lane.title,
				short: true
			} ],
			mrkdwn_in: [ "text" ]
		};

		if ( card.priority === "critical" || card.priority === "high" ) {
			attachment.fields.push( {
				title: "Priority",
				value: card.priority === "critical" ? "❗Critical" : "🔺High",
				short: true
			} );
		}

		if ( card.customId && card.customId.value ) {
			attachment.fields.push( {
				title: "Custom Id",
				value: card.customId.value,
				short: true
			} );
		}

		if ( card.tags && card.tags.length ) {
			attachment.fields.push( {
				title: "Tags",
				value: card.tags.join( ", " ),
				short: true
			} );
		}

		if ( card.blockedStatus.isBlocked ) {
			attachment.fields.unshift( {
				title: "⛔ Blocked",
				value: card.blockedStatus.reason
			} );

			attachment.fallback += " (Blocked)";
		}

		return attachment;
	};

	// return function unfurlCard( log, link ) {
	// 	return leankit( link.subdomain ).card( link.cardId ).get().then( card => {
	// 		const attachment = link.attachment = {
	// 			title_link: `https://${ link.subdomain }.leankit.com/card/${ link.cardId }`,
	// 			title: `${ card.type.title }: ${ card.title }`,
	// 			fallback: `${ card.board.title } > ${ card.lane.title } > ${ card.type.title }: ${ card.title }`,
	// 			text: card.description && htmlToSlackMarkdown( card.description ),
	// 			color: card.color, // card.blockedStatus.isBlocked ? "danger" : "good", // "warning" "danger" "#ff00ff"
	// 			fields: [ {
	// 				title: "On Board",
	// 				value: card.board.title,
	// 				short: true
	// 			}, {
	// 				title: "In Lane",
	// 				value: card.lane.title,
	// 				short: true
	// 			} ],
	// 			mrkdwn_in: [ "text" ]
	// 		};

	// 		if ( card.priority === "critical" || card.priority === "high" ) {
	// 			attachment.fields.push( {
	// 				title: "Priority",
	// 				value: card.priority === "critical" ? "❗Critical" : "🔺High",
	// 				short: true
	// 			} );
	// 		}

	// 		if ( card.customId && card.customId.value ) {
	// 			attachment.fields.push( {
	// 				title: "Custom Id",
	// 				value: card.customId.value,
	// 				short: true
	// 			} );
	// 		}

	// 		if ( card.tags && card.tags.length ) {
	// 			attachment.fields.push( {
	// 				title: "Tags",
	// 				value: card.tags.join( ", " ),
	// 				short: true
	// 			} );
	// 		}

	// 		if ( card.blockedStatus.isBlocked ) {
	// 			attachment.fields.unshift( {
	// 				title: "⛔ Blocked",
	// 				value: card.blockedStatus.reason
	// 			} );

	// 			attachment.fallback += " (Blocked)";
	// 		}

	// 		log.info( `Unfurled card (${ link.subdomain }/${ link.cardId }): ${ attachment.fallback }` );

	// 		return link;
	// 	} ).catch( err => {
	// 		if ( err.statusCode === 403 ) {
	// 			log.info( `No read permissions for card: ${ link.subdomain }/${ link.cardId }` );
	// 			link.attachment = {
	// 				text: `The LeanKit Linker does not have permissions to see that card (${ link.cardId }). Contact your LeanKit administrator if you’d like the board to be visible to all slack users in your organization.`
	// 			};
	// 			return link;
	// 		}

	// 		log.error( `Unable to load card: ${ link.subdomain }/${ link.cardId }`, err.stack );

	// 		return false;
	// 	} );
	// };
};
