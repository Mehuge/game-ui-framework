module.exports = function(options) {

	return { 

		spamScore: function(text) {
			var filters = options.filters, score = 0;
			if (filters) {
				// Clean up text (remove punctionation etc)
				text = text.replace(/[^A-Za-z0-9]/g,'').toLowerCase();

				// See which filters message matches
				for (var f = 0; f < filters.length; f++) {
					var fscore = filters[f][0];
					var fpattern = new RegExp(filters[f][1]);
					if (text.match(fpattern)) {
						score += fscore;
					}
				}
			}
			return score;
		}
		
	};

};
