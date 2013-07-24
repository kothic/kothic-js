
Kothic.CollisionBuffer = function (height, width) {
    this.buffer = rbush();
    this.height = height;
    this.width = width;
};

Kothic.CollisionBuffer.prototype = {
    addPointWH: function (point, w, h, d, id) {
        this.buffer.insert(this.getBoxFromPoint(point, w, h, d, id));
    },

    addPoints: function (params) {
        var points = [];
        for (var i = 0, len = params.length; i < len; i++) {
            points.push(this.getBoxFromPoint.apply(this, params[i]));
        }
        this.buffer.load(points);
    },

    checkBox: function (b, id) {
        var result = this.buffer.search(b),
            i, len;

        if (b[0] < 0 || b[1] < 0 || b[2] > this.width || b[3] > this.height) { return true; }

        for (i = 0, len = result.length; i < len; i++) {
            // if it's the same object (only different styles), don't detect collision
            if (id !== result[i][4]) {
                return true;
            }
        }

        return false;
    },

    checkPointWH: function (point, w, h, id) {
        return this.checkBox(this.getBoxFromPoint(point, w, h, 0), id);
    },

    getBoxFromPoint: function (point, w, h, d, id) {
        var dx = w / 2 + d,
            dy = h / 2 + d;

        return [
            point[0] - dx,
            point[1] - dy,
            point[0] + dx,
            point[1] + dy,
            id
        ];
    }
};
