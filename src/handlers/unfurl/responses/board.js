module.exports = ( app ) => {
	return function buildBoardRepresentation( board ) {
		return {
			title_link: `https://${ board.subdomain }.leankit.com/board/${ board.boardId }`,
			title: `Board: ${ board.title }`,
			fallback: `Board: ${ board.title }`,
			text: board.description
		};
	};
};
