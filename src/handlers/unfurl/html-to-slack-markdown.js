const htmlparser = require( "htmlparser" );
const Entities = require( "html-entities" ).AllHtmlEntities;

const entities = new Entities( );

module.exports = function slackify( html ) {
	const handler = new htmlparser.DefaultHandler( ( error, dom ) => {
		// error ignored
	} );

	const parser = new htmlparser.Parser( handler );
	parser.parseComplete( html );

	if ( handler.dom ) {
		return entities.decode( walk( handler.dom ) );
	}
	return "";
};

function walk( dom, disableNesting ) {
	let out = "";

	( dom || [] ).forEach( el => {
		if ( "text" === el.type ) {
			out += el.data;
		} else if ( "tag" === el.type ) {
			if ( disableNesting ) {
				out += walk( el.children, true );
			} else {
				switch ( el.name ) {
					case "a":
						out += `<${ el.attribs.href }|${ walk( el.children, true ) }>`;
						break;
					case "strong":
					case "b":
						out += `*${ walk( el.children ) }*`;
						break;
					case "i":
					case "em":
						out += `_${ walk( el.children ) }_`;
						break;
					case "br":
						out += "\n";
						break;
					case "div":
					case "p":
					case "ul":
					case "ol":
						out += `\n${ walk( el.children ) }`;
						break;
					case "li":
						out += `- ${ walk( el.children ) }\n`;
						break;
					default:
						out += walk( el.children );
				}
			}
		}
	} );

	return out;
}
