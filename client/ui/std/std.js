"use strict";
define(function() {
	return UI.std = {
		pad: function(s,n) {
			return String(s).length < n ? this.pad('0'+s,n) : s;
		}
	};
});
