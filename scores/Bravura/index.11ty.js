// (U+E000 through U+FFFF)
module.exports = class {
    data() {
        return {
	    layout: 'score',
	    title: 'Bravura test',
	    status: 'unlisted'
	}
    }

    render(data) {
        return `<link rel="stylesheet" type="text/css" href="/assets/fonts/bravura-woff.css">`
    }
};
