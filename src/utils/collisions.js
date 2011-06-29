/**
 * @preserve Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 * Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 * See http://github.com/kothic/kothic-js for more information.
 */

(function(Kothic) {
	Kothic.CollisionBuffer = function (ctx, debugBoxes, debugChecks) {
		this.buffer = [];

		// for debugging
		this.ctx = ctx;
		this.debugBoxes = debugBoxes;
		this.debugChecks = debugChecks;
	}

	Kothic.CollisionBuffer.prototype = {
		addBox: function(box) {
			this.buffer.push(box);
		},

		addPointWH: function(point, w, h, d, id) {
			var box = this.getBoxFromPoint(point, w, h, d, id);

			this.buffer.push(box);

			if (this.debugBoxes) {
				this.ctx.save();
				this.ctx.strokeStyle = 'red';
				this.ctx.lineWidth = '1';
				this.ctx.strokeRect(box[0], box[1], box[2] - box[0], box[3] - box[1]);
				this.ctx.restore();
			}
		},

		checkBox: function(b) {
			for (var i = 0, len = this.buffer.length, c; i < len; i++) {
				c = this.buffer[i];

				// if it's the same object (only different styles), don't detect collision
				if (b[4] && (b[4] == c[4])) continue;

				if (c[0] <= b[2] && c[1] <= b[3] && c[2] >= b[0] && c[3] >= b[1]) {
					if (this.debugChecks) {
						this.ctx.save();
						this.ctx.strokeStyle = 'darkblue';
						this.ctx.lineWidth = '1';
						this.ctx.strokeRect(b[0], b[1], b[2] - b[0], b[3] - b[1]);
						this.ctx.restore();
					}
					return true;
				}
			}
			return false;
		},

		checkPointWH: function(point, w, h, id) {
			return this.checkBox(this.getBoxFromPoint(point, w, h, 0, id));
		},

		getBoxFromPoint: function(point, w, h, d, id) {
			return [point[0] - w / 2 - d,
				point[1] - h / 2 - d,
				point[0] + w / 2 + d,
				point[1] + h / 2 + d,
				id];
		}
	};
})(Kothic);
