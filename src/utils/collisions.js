/**
 * @preserve Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 * Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 * See http://github.com/kothic/kothic-js for more information.
 */

(function (Kothic) {
	Kothic.CollisionBuffer = function (height, width) {
		this.buffer = new RTree();
		this.height = height;
		this.width = width;
	};

	Kothic.CollisionBuffer.prototype = {
		addBox: function (box) {
			this.buffer.insert(new RTree.Rectangle(box[0], box[1], box[2], box[3]), box[4]);
		},

		addPointWH: function (point, w, h, d, id) {
			this.buffer.insert(this.getBoxFromPoint(point, w, h, d), id);
		},

		checkBox: function (b, id) {
			if (this.height && !(b.x1 >= 0 && b.y1 >= 0 && b.y2 <= this.height && b.x2 <= this.width)) {
				return true;
			}
			
            var obj = [], objects = this.buffer.search(b, true, obj), i, len, c;
			
            for (i = 0, len = obj.length, c; i < len; i++) {
				c = obj[i];

				// if it's the same object (only different styles), don't detect collision
				if (id !== c.leaf) { 
                    return true;
                }
				
			}
			return false;
		},

		checkPointWH: function (point, w, h, id) {
			return this.checkBox(this.getBoxFromPoint(point, w, h, 0), id);
		},

		getBoxFromPoint: function (point, w, h, d, id) {
			return new RTree.Rectangle(point[0] - w / 2 - d,
				point[1] - h / 2 - d,
                w + 2 * d,
                h + 2 * d);
		}
	};
}(Kothic));
