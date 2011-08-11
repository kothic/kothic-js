/**
 * @preserve Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 * Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 * See http://github.com/kothic/kothic-js for more information.
 */
 
 Kothic.Canvas = L.Class.extend({
    options: {
        buffered: false,
        //TODO: Use features detector
        useProxy: false
    },
    
    initialize: function (canvas, options) {
        L.Util.setOptions(this, options);
        
        if (typeof canvas == 'string') {
            this.canvas = document.getElementById(canvas);
        } else {
            this.canvas = canvas;
        }
        
        this.width = canvas.width, this.height = canvas.height;
        
        //TODO: Try to reuse canvases instead of creating new one
        //Create invisible canvas for double buffering
		if (this.options.buffered) {
			this.buffer = document.createElement('canvas');

			this.buffer.width = canvas.width;
			this.buffer.height = canvas.height;

			this.ctx = this.buffer.getContext('2d');
		} else {
            this.ctx = this.canvas.getContext('2d');
            
        }
        
        if (options.useProxy) {
            this.ctx = new CanvasProxy(this.ctx);
        }
    },
    
    completeRendering: function () {
        if (this.options.buffered) {
            this.canvas.getContext('2d').drawImage(this.buffer, 0, 0);
        }
    }
});
