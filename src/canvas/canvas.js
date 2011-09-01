/**
 * @preserve Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 * Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 * See http://github.com/kothic/kothic-js for more information.
 */
 
Kothic.Canvas = K.Class.extend({
    options: {
        buffered: false,
        useCanvasProxy: false
    },
    
    initialize: function (canvas, options) {
        K.Utils.setOptions(this, options);
        
        if (typeof canvas === 'string') {
            this.canvas = document.getElementById(canvas);
        } else {
            this.canvas = canvas;
        }
        
        this.width = canvas.width;
        this.height = canvas.height;
        
        //Create invisible canvas for double buffering
		if (this.options.buffered) {
            if (Kothic.Canvas.buffers.length > 0) {
                this.buffer = Kothic.Canvas.buffers.pop();
            } else {
			    this.buffer = document.createElement('canvas');
            }

			this.buffer.width = canvas.width;
			this.buffer.height = canvas.height;

			this.ctx = this.buffer.getContext('2d');
		} else {
            this.ctx = this.canvas.getContext('2d');
            
        }
        
        if (options.useCanvasProxy) {
            this.ctx = new CanvasProxy(this.ctx);
        }
    },
    
    completeRendering: function () {
        if (this.options.buffered) {
            this.canvas.getContext('2d').drawImage(this.buffer, 0, 0);
            Kothic.Canvas.buffers.push(this.buffer);
        }
    }
});

Kothic.Canvas.buffers = []; 
