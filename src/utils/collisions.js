/**
 * @preserve Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 * Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 * See http://github.com/kothic/kothic-js for more information.
 */

(function(Kothic) {
	Kothic.CollisionBuffer = function (ctx, debugBoxes, debugChecks) {
		this.buffer = new RTree();

		// for debugging
		this.ctx = ctx;
		this.debugBoxes = debugBoxes;
		this.debugChecks = debugChecks;
	}

	Kothic.CollisionBuffer.prototype = {
		addBox: function(box) {
			this.buffer.insert(new RTree.Rectangle(box[0], box[1], box[2], box[3]), box[4]);
		},

		addPointWH: function(point, w, h, d, id) {
			var box = this.getBoxFromPoint(point, w, h, d);

			this.buffer.insert(box, id);

			if (this.debugBoxes) {
				this.ctx.save();
				this.ctx.strokeStyle = 'red';
				this.ctx.lineWidth = '1';
				this.ctx.strokeRect(box[0], box[1], box[2] - box[0], box[3] - box[1]);
				this.ctx.restore();
			}
		},

		checkBox: function(b, id) {
            var obj = [];
            var objects = this.buffer.search(b, true, obj);
			for (var i = 0, len = obj.length, c; i < len; i++) {
				c = obj[i];

				// if it's the same object (only different styles), don't detect collision
				if (id == c) continue;

				/** if (c[0] <= b[2] && c[1] <= b[3] && c[2] >= b[0] && c[3] >= b[1]) {
					if (this.debugChecks) {
						this.ctx.save();
						this.ctx.strokeStyle = 'darkblue';
						this.ctx.lineWidth = '1';
						this.ctx.strokeRect(b[0], b[1], b[2] - b[0], b[3] - b[1]);
						this.ctx.restore();
					} **/
				return true;
			}
			return false;
		},

		checkPointWH: function(point, w, h, id) {
			return this.checkBox(this.getBoxFromPoint(point, w, h, 0), id);
		},

		getBoxFromPoint: function(point, w, h, d, id) {
			return new RTree.Rectangle(point[0] - w / 2 - d,
				point[1] - h / 2 - d,
                w+2*d,
                h+2*d);
		}
	};
})(Kothic);
