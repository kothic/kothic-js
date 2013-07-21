(function() {
	var scripts = [
		'kothic.js',
		'renderer/path.js',
		'renderer/line.js',
		'renderer/polygon.js',
		'renderer/shields.js',
		'renderer/texticons.js',
		'renderer/text.js',
		'style/mapcss.js',
		'style/style.js',
		'utils/collisions.js',
		'utils/geom.js',
		'utils/rbush.js'
	];

	function getSrcUrl() {
		var scripts = document.getElementsByTagName('script');
		for (var i = 0; i < scripts.length; i++) {
			var src = scripts[i].src;
			if (src) {
				var res = src.match(/^(.*)kothic-include\.js$/);
				if (res) {
					return res[1] + '../src/';
				}
			}
		}

        return "";
	}

	var path = getSrcUrl();
	for (var i = 0; i < scripts.length; i++) {
		document.writeln("<script type=\"text/javascript\" src='" + path + "../src/" + scripts[i] + "'></script>");
	}
})();
