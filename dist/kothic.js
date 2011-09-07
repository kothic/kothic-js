/*
 Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 See http://github.com/kothic/kothic-js for more information.
*/
K={};K.Utils={setOptions:function(b,c){b.options=K.Utils.extend({},b.options,c)},extend:function(b){var c=Array.prototype.slice.call(arguments,1),e=c.length,g,d,f;for(d=0;d<e;d++)for(g in f=c[d]||{},f)f.hasOwnProperty(g)&&(b[g]=f[g]);return b},isEmpty:function(b){for(var c in b)if(b.hasOwnProperty(c))return!1;return!0}};K.Class=function(){};
K.Class.extend=function(b){var c=function(){this.initialize&&this.initialize.apply(this,arguments)},e=function(){};e.prototype=this.prototype;e=new e;e.constructor=c;c.prototype=e;c.superclass=this.prototype;for(var g in this)this.hasOwnProperty(g)&&g!="prototype"&&g!="superclass"&&(c[g]=this[g]);b.statics&&(K.Utils.extend(c,b.statics),delete b.statics);b.includes&&(K.Utils.extend.apply(null,[e].concat(b.includes)),delete b.includes);if(b.options&&e.options)b.options=K.Utils.extend({},e.options,b.options);
K.Utils.extend(e,b);c.extend=arguments.callee;c.include=function(b){K.Utils.extend(this.prototype,b)};return c};/*
 Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 See http://github.com/kothic/kothic-js for more information.
*/
Kothic=K.Class.extend({options:{buffered:!1,useCanvasProxy:!1,styles:[],locales:[]},initialize:function(b){K.Utils.setOptions(this,b);MapCSS.locales=this.options.locales},render:function(b,c,e,g){var d=new Kothic.Canvas(b,{buffererd:this.options.buffered,useCanvasProxy:this.options.useCanvasProxy}),f=d.width,h=d.height,i=c.granularity,m=f/i,k=h/i,n=d.ctx,p=this.options.styles,q=new Kothic.CollisionBuffer(h,f),j=new Kothic.Debug,v=this._populateLayers(c.features,e,p),l=Kothic.utils.getOrderedKeys(v);
j.addEvent("layers styled: "+MapCSS.debug.hit+"/"+MapCSS.debug.miss);MapCSS.debug.miss=0;MapCSS.debug.hit=0;Kothic.style.setStyles(n,Kothic.style.defaultCanvasStyles);var s=this,r=function(){s._renderTextAndIcons(l,v,n,m,k,q);j.addEvent("labels rendered");d.completeRendering();j.addEvent("buffer was copied");g(j)};setTimeout(function(){s._renderBackground(n,f,h,e,p);var b=s._renderGeometryFeatures(l,v,n,m,k,i);j.addEvent("geometry rendered");j.setStats(b);setTimeout(r,0)},0)},_populateLayers:function(b,
c,e){for(var g={},e=Kothic.style.styleFeatures(b,c,e),b=0,c=e.length;b<c;b++){var d=e[b],f=parseFloat(d.properties.layer)||0,h=d.style["-x-mapnik-layer"];h==="top"&&(f=1E4);h==="bottom"&&(f=-1E4);g.hasOwnProperty(f)||(g[f]=[]);g[f].push(d)}return g},_renderBackground:function(b,c,e,g,d){var g=MapCSS.restyle(d,{},{},g,"canvas","canvas"),d=Kothic.utils.getOrderedKeys(g),f,h=function(){b.fillRect(-1,-1,c+1,e+1)};for(f=0;f<d.length;f++)Kothic.polygon.fill(b,g[d[f]],h)},_renderGeometryFeatures:function(b,
c,e,g,d,f){var h=0,i=0,m=0,k,n;for(n=0;n<b.length;n++){var p=c[b[n]],q=p.length;for(k=0;k<q;k++){var j=p[k].style;if(j.hasOwnProperty("fill-color")||j.hasOwnProperty("fill-image"))Kothic.polygon.render(e,p[k],p[k+1],g,d,f),h+=1}e.lineCap="butt";for(k=0;k<q;k++)p[k].style.hasOwnProperty("casing-width")&&(Kothic.line.renderCasing(e,p[k],p[k+1],g,d,f),m+=1);e.lineCap="round";for(k=0;k<q;k++)p[k].style.width&&(Kothic.line.render(e,p[k],p[k+1],g,d,f),i+=1)}return{"polygons rendered ":h,"lines rendered ":i,
"casings rendered ":m}},_renderTextAndIcons:function(b,c,e,g,d,f){var h=e.strokeText&&e.fillText&&e.measureText,i=0,m=0,k=0,n,p,q;for(q=0;q<b.length;q++){var j=c[b[q]],v=j.length;for(n=v-1;n>=0;n--)p=j[n].style,p.hasOwnProperty("icon-image")&&!p.text&&(Kothic.texticons.render(e,j[n],f,g,d,!1,!0),i+=1);for(n=v-1;h&&n>=0;n--)p=j[n].style,!p.hasOwnProperty("icon-image")&&p.text&&(Kothic.texticons.render(e,j[n],f,g,d,!0,!1),m+=1);for(n=v-1;n>=0;n--)p=j[n].style,p.hasOwnProperty("icon-image")&&p.text&&
(Kothic.texticons.render(e,j[n],f,g,d,h,!0),i+=1,m+=1);for(n=v-1;h&&n>=0;n--)p=j[n].style,p["shield-text"]&&(Kothic.shields.render(e,j[n],f,g,d),k+=1)}return{"icons rendered ":i,"labels rendered ":m,"shields rendered ":k}}});/*
 Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 See http://github.com/kothic/kothic-js for more information.
*/
Kothic.Canvas=K.Class.extend({options:{buffered:!1,useCanvasProxy:!1},initialize:function(b,c){K.Utils.setOptions(this,c);this.canvas=typeof b==="string"?document.getElementById(b):b;this.width=b.width;this.height=b.height;this.options.buffered?(this.buffer=Kothic.Canvas.buffers.length>0?Kothic.Canvas.buffers.pop():document.createElement("canvas"),this.buffer.width=b.width,this.buffer.height=b.height,this.ctx=this.buffer.getContext("2d")):this.ctx=this.canvas.getContext("2d");if(c.useCanvasProxy)this.ctx=
new CanvasProxy(this.ctx)},completeRendering:function(){this.options.buffered&&(this.canvas.getContext("2d").drawImage(this.buffer,0,0),Kothic.Canvas.buffers.push(this.buffer))}});Kothic.Canvas.buffers=[];/*
 Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 See http://github.com/kothic/kothic-js for more information.
*/
CanvasProxy=function(b){var c={strokeStyle:"rgba(0,0,0,0.5)",fillStyle:"rgba(0,0,0,0.5)",lineWidth:1,globalAlpha:1,lineCap:"round",lineJoin:"round",textAlign:"center",textBaseline:"middle"};_textMeasureCache={};for(var e in this._curProps)c.hasOwnProperty(e)&&(this[e]=c[e],b[e]=c[e]);this.antialiasing="default";this._checkStroke=function(){var g=["globalAlpha","strokeStyle","lineWidth","lineCap","lineJoin"],d;for(d in g)d=g[d],this[d]!=c[d]&&this[d]&&(b[d]=this[d],c[d]=this[d])};this._checkFill=function(){var g=
["globalAlpha","fillStyle"],d;for(d in g)d=g[d],this[d]!=c[d]&&this[d]&&(b[d]=this[d],c[d]=this[d])};this._checkText=function(){var g=["font","textAlign","textBaseline"],d;for(d in g)d=g[d],this[d]!=c[d]&&this[d]&&(b[d]=this[d],c[d]=this[d])};this._resetAfterRestore=function(){var c=["fillStyle","strokeStyle","lineCap","textAlign","textBaseline","globalAlpha"],d;for(d in c)d=c[d],this[d]&&(b[d]=this[d])};this.fillRect=function(c,d,f,h){this._checkFill();b.fillRect(c,d,f,h)};this.drawImage=function(c,
d,f){b.drawImage(c,d,f)};this.lineTo=function(c,d){b.lineTo(c,d)};this.moveTo=function(c,d){b.moveTo(c,d)};this.translate=function(c,d){b.translate(c,d)};this.createPattern=function(c,d){b.createPattern(c,d)};this.rotate=function(c){b.rotate(c)};this.save=function(){b.save()};this.restore=function(){b.restore();this._resetAfterRestore()};this.beginPath=function(){b.beginPath()};this.stroke=function(){this._checkStroke();b.stroke()};this.fill=function(){this._checkFill();b.fill()};this.fillText=function(c,
d,f){this._checkFill();this._checkText();b.fillText(c,d,f)};this.strokeText=function(c,d,f){this._checkStroke();this._checkText();b.strokeText(c,d,f)};this.measureText=function(c){this._checkText();var d=this.font;_textMeasureCache[d]||(_textMeasureCache[d]={});_textMeasureCache[d][c]||(_textMeasureCache[d][c]=b.measureText(c));return _textMeasureCache[d][c]}};/*
 Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 See http://github.com/kothic/kothic-js for more information.
*/
Kothic.path=function(){function b(b,c){g={pattern:c,seg:0,phs:0,x:b[0],y:b[1]}}function c(b,c){var h=g,e=c[0]-h.x,m=c[1]-h.y,k=Math.sqrt(e*e+m*m),n;b.save();b.translate(h.x,h.y);b.rotate(Math.atan2(m,e));b.moveTo(0,0);e=0;do{n=h.pattern[h.seg];e+=n-h.phs;m=e<k;if(!m)h.phs=n-(e-k),e=k;b[h.seg%2?"moveTo":"lineTo"](e,0);if(m)h.phs=0,h.seg=++h.seg%h.pattern.length}while(m);h.x=c[0];h.y=c[1];b.restore()}function e(b,c){return b[0]===0||b[0]===c||b[1]===0||b[1]===c}var g;return function(d,f,h,g,m,k,n){var p=
f.type,f=f.coordinates;p==="Polygon"&&(f=[f],p="MultiPolygon");p==="LineString"&&(f=[f],p="MultiLineString");var q,j,v,l,s=f.length,r,o,t,u,w;if(p==="MultiPolygon")for(q=0;q<s;q++){v=0;for(r=f[q].length;v<r;v++){l=f[q][v];o=l.length;t=l[0];for(j=0;j<=o;j++)u=l[j]||l[0],w=Kothic.utils.transformPoint(u,m,k),j===0||!g&&e(u,n)&&e(t,n)?(t=h,d.moveTo(w[0],w[1]),t&&b(w,t)):g||!h?d.lineTo(w[0],w[1]):c(d,w),t=u}}if(p==="MultiLineString")for(q=0;q<s;q++){l=f[q];o=l.length;for(j=0;j<o;j++){u=l[j];w=Kothic.utils.transformPoint(u,
m,k);if((j===0||j===o-1)&&e(u,n))t=l[j?o-2:1],g=u[0]-t[0],p=u[1]-t[1],u=Math.sqrt(g*g+p*p),w=[w[0]+50*g/u,w[1]+50*p/u];j===0?(g=w,p=h,d.moveTo(g[0],g[1]),p&&b(g,p)):h?c(d,w):d.lineTo(w[0],w[1])}}}}();/*
 Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 See http://github.com/kothic/kothic-js for more information.
*/
Kothic.line=function(){return{pathOpened:!1,renderCasing:function(b,c,e,g,d,f){var h=c.style,i=e&&e.style,m=h["casing-dashes"]||h.dashes||!1;if(!this.pathOpened)this.pathOpened=!0,b.beginPath();Kothic.path(b,c,m,!1,g,d,f);if(!e||!(i.width===h.width&&i["casing-width"]===h["casing-width"]&&i["casing-color"]===h["casing-color"]&&(i["casing-dashes"]||i.dashes||!1)===(h["casing-dashes"]||h.dashes||!1)&&(i["casing-linecap"]||i.linecap||"butt")===(h["casing-linecap"]||h.linecap||"butt")&&(i["casing-linejoin"]||
i.linejoin||"round")===(h["casing-linejoin"]||h.linejoin||"round")&&(i["casing-opacity"]||i.opacity)===(h.opacity||h["casing-opacity"])))Kothic.style.setStyles(b,{lineWidth:2*h["casing-width"]+(h.hasOwnProperty("width")?h.width:0),strokeStyle:h["casing-color"]||"#000000",lineCap:h["casing-linecap"]||h.linecap||"butt",lineJoin:h["casing-linejoin"]||h.linejoin||"round",globalAlpha:h["casing-opacity"]||1}),this.pathOpened=!1,b.stroke()},render:function(b,c,e,g,d,f){var h=c.style,i=e&&e.style,m=h.dashes;
if(!this.pathOpened)this.pathOpened=!0,b.beginPath();Kothic.path(b,c,m,!1,g,d,f);if(!e||!((i.width||1)===(h.width||1)&&(i.color||"#000000")===(h.color||"#000000")&&i.linecap===h.linecap&&i.linejoin===h.linejoin&&i.image===h.image&&i.opacity===h.opacity)){if(h.hasOwnProperty("color")||!h.hasOwnProperty("image"))Kothic.style.setStyles(b,{lineWidth:h.width||1,strokeStyle:h.color||"#000000",lineCap:h.linecap||"round",lineJoin:h.linejoin||"round",globalAlpha:h.opacity||1}),b.stroke();if(h.hasOwnProperty("image")&&
(c=MapCSS.getImage(h.image)))Kothic.style.setStyles(b,{strokeStyle:b.createPattern(c,"repeat")||"#000000",lineWidth:h.width||1,lineCap:h.linecap||"round",lineJoin:h.linejoin||"round",globalAlpha:h.opacity||1}),b.stroke();this.pathOpened=!1}}}}();/*
 Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 See http://github.com/kothic/kothic-js for more information.
*/
Kothic.polygon=function(){return{pathOpened:!1,render:function(b,c,e,g,d,f){var h=c.style,i=e&&e.style;if(!this.pathOpened)this.pathOpened=!0,b.beginPath();Kothic.path(b,c,!1,!0,g,d,f);if(!e||!(i["fill-color"]===h["fill-color"]&&i["fill-image"]===h["fill-image"]&&i["fill-opacity"]===h["fill-opacity"]))this.fill(b,h,function(){b.fill()}),this.pathOpened=!1},fill:function(b,c,e){var g=c["fill-opacity"]||c.opacity;c.hasOwnProperty("fill-color")&&(Kothic.style.setStyles(b,{fillStyle:c["fill-color"]||
"#000000",globalAlpha:g||1}),e());if(c.hasOwnProperty("fill-image")&&(c=MapCSS.getImage(c["fill-image"])))Kothic.style.setStyles(b,{fillStyle:b.createPattern(c,"repeat"),globalAlpha:g||1}),e()}}}();/*
 Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 See http://github.com/kothic/kothic-js for more information.
*/
Kothic.shields=function(){return{render:function(b,c,e,g,d){var f=c.style,h=Kothic.utils.getReprPoint(c),i,m,k=0,n=!1,p,q;if(h){i=Kothic.utils.transformPoint(h,g,d);if(f["shield-image"]&&(m=MapCSS.getImage(f["icon-image"]),!m))return;Kothic.style.setStyles(b,{font:Kothic.style.getFontString(f["shield-font-family"]||f["font-family"],f["shield-font-size"]||f["font-size"]),fillStyle:f["shield-text-color"]||"#000000",globalAlpha:f["shield-text-opacity"]||f.opacity||1,textAlign:"center",textBaseline:"middle"});
var j=String(f["shield-text"]),h=b.measureText(j).width,v=h+2,l=h/j.length*1.8;if(c.type==="LineString"){k=Kothic.geomops.getPolyLength(c.coordinates);if(Math.max(l/d,v/g)>k)return;p=0;for(q=1;p<k/2;p+=Math.max(k/30,l/g),q*=-1){h=Kothic.geomops.getAngleAndCoordsAtLength(c.coordinates,k/2+q*p,0);if(!h)break;h=[h[1],h[2]];i=Kothic.utils.transformPoint(h,g,d);if((!m||!(f["allow-overlap"]!=="true"&&e.checkPointWH(i,m.width,m.height,c.kothicId)))&&!(f["allow-overlap"]!=="true"&&e.checkPointWH(i,v,l,c.kothicId))){n=
!0;break}}}n&&(f["shield-casing-width"]&&(Kothic.style.setStyles(b,{fillStyle:f["shield-casing-color"]||"#000000",globalAlpha:f["shield-casing-opacity"]||f.opacity||1}),b.fillRect(i[0]-v/2-(f["shield-casing-width"]||0)-(f["shield-frame-width"]||0),i[1]-l/2-(f["shield-casing-width"]||0)-(f["shield-frame-width"]||0),v+2*(f["shield-casing-width"]||0)+2*(f["shield-frame-width"]||0),l+2*(f["shield-casing-width"]||0)+2*(f["shield-frame-width"]||0))),f["shield-frame-width"]&&(Kothic.style.setStyles(b,{fillStyle:f["shield-frame-color"]||
"#000000",globalAlpha:f["shield-frame-opacity"]||f.opacity||1}),b.fillRect(i[0]-v/2-(f["shield-frame-width"]||0),i[1]-l/2-(f["shield-frame-width"]||0),v+2*(f["shield-frame-width"]||0),l+2*(f["shield-frame-width"]||0))),f["shield-color"]&&(Kothic.style.setStyles(b,{fillStyle:f["shield-color"]||"#000000",globalAlpha:f["shield-opacity"]||f.opacity||1}),b.fillRect(i[0]-v/2,i[1]-l/2,v,l)),m&&b.drawImage(m,Math.floor(i[0]-m.width/2),Math.floor(i[1]-m.height/2)),Kothic.style.setStyles(b,{fillStyle:f["shield-text-color"]||
"#000000",globalAlpha:f["shield-text-opacity"]||f.opacity||1}),b.fillText(j,i[0],Math.ceil(i[1])),m&&e.addPointWH(i,m.width,m.height,0,c.kothicId),e.addPointWH(i,l,v,(parseFloat(f["shield-casing-width"])||0)+(parseFloat(f["shield-frame-width"])||0)+(parseFloat(f["-x-mapnik-min-distance"])||30),c.kothicId))}}}}();/*
 Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 See http://github.com/kothic/kothic-js for more information.
*/
Kothic.textOnPath=function(){function b(b,c){return b.measureText(c).width}function c(b,c){return[b[1]+0.5*Math.cos(b[0])*c,b[2]+0.5*Math.sin(b[0])*c]}function e(d,h,e,g){var g=g||0,k=b(d,h),h=b(d,h.charAt(0))*1.5,n=e[0],d=Math.abs(Math.cos(n)*k)+Math.abs(Math.sin(n)*h),h=Math.abs(Math.sin(n)*k)+Math.abs(Math.cos(n)*h);return[c(e,k+2*g),d,h,0]}function g(c,d,g,m){var k,n=0;for(k=0;k<=g.length;k++){if(c.checkPointWH.apply(c,e(d,g.charAt(k),m,n)))return!0;n+=b(d,g.charAt(k))}return!1}function d(d,e,
g){var m=e[4],k=c(e,b(d,m));d.translate(k[0],k[1]);d.rotate(e[0]);d[g?"strokeText":"fillText"](m,0,0);d.rotate(-e[0]);d.translate(-k[0],-k[1])}return function(c,h,i,m,k){var n=c.measureText(i).width,p=i.length,q=Kothic.geomops.getPolyLength(h);if(!(q<n)){for(var j,v,l,s,r=0,o,t=!1,u,w,x,y=Math.PI/6;r<2;){v=r?b(c,i.charAt(0)):(q-n)/2;o=0;l=null;s=[];for(x=0;x<p;x++){j=i.charAt(x);w=b(c,j);u=Kothic.geomops.getAngleAndCoordsAtLength(h,v,w);if(v>=q||!u){r++;s=[];t&&(h.reverse(),t=!1);break}l||(l=u[0]);
if(g(k,c,j,u)||Math.abs(l-u[0])>y)v+=w,x=-1,s=[],o=0;else{for(;w<u[3]&&x<p;){x++;j+=i.charAt(x);w=b(c,j);if(g(k,c,j,u)){x=0;v+=w;s=[];o=0;j=i.charAt(x);w=b(c,j);u=Kothic.geomops.getAngleAndCoordsAtLength(h,v,w);break}if(w>=u[3]){x--;j=j.slice(0,-1);w=b(c,j);break}}if(u){if(u[0]>Math.PI/2||u[0]<-Math.PI/2)o+=j.length;l=u[0];u.push(j);s.push(u);v+=w}}}o>p/2&&(h.reverse(),s=[],t?(r++,h.reverse(),t=!1):t=!0);if(r>=2)return;if(s.length>0)break}h=s.length;for(x=0;m&&x<h;x++)d(c,s[x],!0);for(x=0;x<h;x++){u=
s[x];d(c,u);m=k;i=c;n=u[4];p=void 0;for(p=q=0;p<=n.length;p++)m.addPointWH.apply(m,e(i,n.charAt(p),u,q)),q+=b(i,n.charAt(p))}}}}();/*
 Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 See http://github.com/kothic/kothic-js for more information.
*/
Kothic.texticons=function(){return{render:function(b,c,e,g,d,f,h){var i=c.style,m,k;if(h||f&&c.type!=="LineString"){k=Kothic.utils.getReprPoint(c);if(!k)return;k=Kothic.utils.transformPoint(k,g,d)}if(h){m=MapCSS.getImage(i["icon-image"]);if(!m)return;if(i["allow-overlap"]!=="true"&&e.checkPointWH(k,m.width,m.height,c.kothicId))return}if(f){Kothic.style.setStyles(b,{lineWidth:i["text-halo-radius"]*2,font:Kothic.style.getFontString(i["font-family"],i["font-size"])});var f=String(i.text),n=b.measureText(f).width,
p=n/f.length*2.5,q=i["text-offset"]||0,j=i.hasOwnProperty("text-halo-radius");Kothic.style.setStyles(b,{fillStyle:i["text-color"]||"#000000",strokeStyle:i["text-halo-color"]||"#ffffff",globalAlpha:i["text-opacity"]||i.opacity||1,textAlign:"center",textBaseline:"middle"});if(c.type==="Polygon"||c.type==="Point"){if(i["text-allow-overlap"]!=="true"&&e.checkPointWH([k[0],k[1]+q],n,p,c.kothicId))return;j&&b.strokeText(f,k[0],k[1]+q);b.fillText(f,k[0],k[1]+q);e.addPointWH([k[0],k[1]+q],n,p,i["-x-mapnik-min-distance"]||
20,c.kothicId)}else c.type==="LineString"&&(g=Kothic.utils.transformPoints(c.coordinates,g,d),Kothic.textOnPath(b,g,f,j,e))}h&&(b.drawImage(m,Math.floor(k[0]-m.width/2),Math.floor(k[1]-m.height/2)),b=parseFloat(i["-x-mapnik-min-distance"])||0,e.addPointWH(k,m.width,m.height,b,c.kothicId))}}}();/*
 Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 See http://github.com/kothic/kothic-js for more information.
*/
var MapCSS={styles:{},availableStyles:[],images:{},locales:[],presence_tags:[],value_tags:[],cache:{},debug:{hit:0,miss:0},onError:function(){},onImagesLoad:function(){},invalidateCache:function(){this.cache={}},e_min:function(){return Math.min.apply(null,arguments)},e_max:function(){return Math.max.apply(null,arguments)},e_any:function(){var b;for(b=0;b<arguments.length;b++)if(typeof arguments[b]!=="undefined"&&arguments[b]!=="")return arguments[b];return""},e_num:function(b){return isNaN(parseFloat(b))?
"":parseFloat(b)},e_str:function(b){return b},e_int:function(b){return parseInt(b,10)},e_tag:function(b,c){return b.hasOwnProperty(c)&&b[c]!==null?a[c]:""},e_prop:function(b,c){return b.hasOwnProperty(c)&&b[c]!==null?b[c]:""},e_sqrt:function(b){return Math.sqrt(b)},e_boolean:function(b,c,e){typeof c==="undefined"&&(c="true");typeof e==="undefined"&&(e="false");return b==="0"||b==="false"||b===""?e:c},e_metric:function(b){return/\d\s*mm$/.test(b)?1E3*parseInt(b,10):/\d\s*cm$/.test(b)?100*parseInt(b,
10):/\d\s*dm$/.test(b)?10*parseInt(b,10):/\d\s*km$/.test(b)?0.001*parseInt(b,10):/\d\s*in$/.test(b)?0.0254*parseInt(b,10):/\d\s*ft$/.test(b)?0.3048*parseInt(b,10):parseInt(b,10)},e_zmetric:function(b){return MapCSS.e_metric(b)},e_localize:function(b,c){var e=MapCSS.locales,g,d;for(g=0;g<e.length;g++)if(d=c+":"+e[g],b[d])return b[d];return b[c]},loadStyle:function(b,c,e,g,d,f){var h,e=e||[],g=g||[];if(d)for(h=0;h<d.length;h++)this.presence_tags.indexOf(d[h])<0&&this.presence_tags.push(d[h]);if(f)for(h=
0;h<f.length;h++)this.value_tags.indexOf(f[h])<0&&this.value_tags.push(f[h]);MapCSS.styles[b]={restyle:c,images:e,external_images:g,textures:{},sprite_loaded:!e,external_images_loaded:!g.length};MapCSS.availableStyles.push(b)},_onImagesLoad:function(b){if(MapCSS.styles[b].external_images_loaded&&MapCSS.styles[b].sprite_loaded)MapCSS.onImagesLoad()},preloadSpriteImage:function(b,c){var e=MapCSS.styles[b].images,g=new Image;delete MapCSS.styles[b].images;g.onload=function(){for(var c in e)if(e.hasOwnProperty(c))e[c].sprite=
g,MapCSS.images[c]=e[c];MapCSS.styles[b].sprite_loaded=!0;MapCSS._onImagesLoad(b)};g.onerror=function(b){MapCSS.onError(b)};g.src=c},preloadExternalImages:function(b){function c(c){var e=new Image;e.onload=function(){d++;MapCSS.images[c]={sprite:e,height:e.height,width:e.width,offset:0};if(d===g)MapCSS.styles[b].external_images_loaded=!0,MapCSS._onImagesLoad(b)};e.onerror=function(){d++;if(d===g)MapCSS.styles[b].external_images_loaded=!0,MapCSS._onImagesLoad(b)};e.src=c}var e=MapCSS.styles[b].external_images;
delete MapCSS.styles[b].external_images;var g=e.length,d=0,f;for(f=0;f<g;f++)c(e[f])},getImage:function(b){var c=MapCSS.images[b];if(c.sprite){var e=document.createElement("canvas");e.width=c.width;e.height=c.height;e.getContext("2d").drawImage(c.sprite,0,c.offset,c.width,c.height,0,0,c.width,c.height);c=MapCSS.images[b]=e}return c},getTagKeys:function(b,c,e,g){var d=[],f;for(f=0;f<this.presence_tags.length;f++)b.hasOwnProperty(this.presence_tags[f])&&d.push(this.presence_tags[f]);for(f=0;f<this.value_tags.length;f++)b.hasOwnProperty(this.value_tags[f])&&
d.push(this.value_tags[f]+":"+b[this.value_tags[f]]);return[c,e,g,d.join(":")].join(":")},restyle:function(b,c,e,g,d){var f,h=this.getTagKeys(c,e,g,d),i=this.cache[h]||{};if(this.cache.hasOwnProperty(h))this.debug.hit+=1;else{this.debug.miss+=1;for(f=0;f<b.length;f++)i=MapCSS.styles[b[f]].restyle(i,c,e,g,d);this.cache[h]=i}return i}};/*
 Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 See http://github.com/kothic/kothic-js for more information.
*/
Kothic.style=function(){return{defaultCanvasStyles:{strokeStyle:"rgba(0,0,0,0.5)",fillStyle:"rgba(0,0,0,0.5)",lineWidth:1,lineCap:"round",lineJoin:"round",textAlign:"center",textBaseline:"middle"},getStyle:function(b,c,e){var g,d;if(b.type==="Polygon"||b.type==="MultiPolygon")g="way",d="area";else if(b.type==="LineString"||b.type==="MultiLineString")g="way",d="line";else if(b.type==="Point"||b.type==="MultiPoint")d=g="node";return MapCSS.restyle(e,b.properties,c,g,d)},styleFeatures:function(b,c,e){var g=
[],d,f,h,i,m,k;d=0;for(h=b.length;d<h;d++)for(f in i=b[d],m=this.getStyle(i,c,e),m)if(m.hasOwnProperty(f))k=Kothic.utils.extend({},i),k.kothicId=d+1,k.style=m[f],g.push(k);g.sort(function(b,c){return parseFloat(b.style["z-index"])-parseFloat(c.style["z-index"]||0)});return g},getFontString:function(b,c){var b=b||"",c=c||9,e=b?b+", ":"",b=b.toLowerCase(),g=[];(b.indexOf("italic")!==-1||b.indexOf("oblique")!==-1)&&g.push("italic");b.indexOf("bold")!==-1&&(g.push("bold"),e+=b.replace("bold","")+", ");
g.push(c+"px");e+=b.indexOf("serif")!==-1?"Georgia, serif":'"Helvetica Neue", Arial, Helvetica, sans-serif';g.push(e);return g.join(" ")},setStyles:function(b,c){for(var e in c)c.hasOwnProperty(e)&&(b[e]=c[e])}}}();/*
 Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 See http://github.com/kothic/kothic-js for more information.
*/
(function(b){b.CollisionBuffer=function(b,e){this.buffer=new RTree;this.height=b;this.width=e};b.CollisionBuffer.prototype={addBox:function(b){this.buffer.insert(new RTree.Rectangle(b[0],b[1],b[2],b[3]),b[4])},addPointWH:function(b,e,g,d,f){this.buffer.insert(this.getBoxFromPoint(b,e,g,d),f)},checkBox:function(b,e){if(this.height&&!(b.x1>=0&&b.y1>=0&&b.y2<=this.height&&b.x2<=this.width))return!0;var g=[];this.buffer.search(b,!0,g);var d,f,h;d=0;for(f=g.length;d<f;d++)if(h=g[d],e!==h.leaf)return!0;
return!1},checkPointWH:function(b,e,g,d){return this.checkBox(this.getBoxFromPoint(b,e,g,0),d)},getBoxFromPoint:function(b,e,g,d){return new RTree.Rectangle(b[0]-e/2-d,b[1]-g/2-d,e+2*d,g+2*d)}}})(Kothic);/*
 Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 See http://github.com/kothic/kothic-js for more information.
*/
Kothic.geomops=function(){return{getPolyLength:function(b){var c=b.length,e,g,d,f,h=0;for(d=1;d<c;d++)e=b[d],g=b[d-1],f=g[0]-e[0],e=g[1]-e[1],h+=Math.sqrt(f*f+e*e);return h},getAngleAndCoordsAtLength:function(b,c,e){var g=b.length,d,f,h,i,m,k,n,p=0;k=0;var q,j=!0;q=!1;e=e||0;for(m=1;m<g;m++){q&&(j=!1);k=b[m];n=b[m-1];d=k[0]-n[0];f=k[1]-n[1];k=Math.sqrt(d*d+f*f);!q&&p+k>=c&&(q=c-p,h=n[0]+d*q/k,i=n[1]+f*q/k,q=!0);if(q&&p+k>=c+e)return q=c+e-p,d=n[0]+d*q/k,f=n[1]+f*q/k,b=Math.atan2(f-i,d-h),j?[b,h,i,
k-q]:[b,h,i,0];p+=k}}}}();/*
 Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 See http://github.com/kothic/kothic-js for more information.
*/
Kothic.utils={transformPoint:function(b,c,e){return[c*b[0],e*b[1]]},transformPoints:function(b,c,e){var g=[],d;d=0;for(len=b.length;d<len;d++)g.push(this.transformPoint(b[d],c,e));return g},getReprPoint:function(b){var c;switch(b.type){case "Point":c=b.coordinates;break;case "Polygon":c=b.reprpoint;break;case "LineString":c=Kothic.geomops.getPolyLength(b.coordinates);c=Kothic.geomops.getAngleAndCoordsAtLength(b.coordinates,c/2,0);c=[c[1],c[2]];break;case "GeometryCollection":return;case "MultiPoint":return;
case "MultiPolygon":c=b.reprpoint;break;case "MultiLineString":return}return c},getOrderedKeys:function(b){var c=[],e;for(e in b)b.hasOwnProperty(e)&&c.push(e);c.sort();return c},extend:function(b,c){for(var e in c)c.hasOwnProperty(e)&&(b[e]=c[e]);return b}};/*
 Copyright (c) 2009 Jon-Carlos Rivera

 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 Jon-Carlos Rivera - imbcmdth@hotmail.com
*/
var RTree=function(b){var c=3,e=6;isNaN(b)||(c=Math.floor(b/2),e=b);var g={x:0,y:0,w:0,h:0,id:"root",nodes:[]},d=function(){var b={};return function(c){var d=0;c in b?d=b[c]++:b[c]=0;return c+"_"+d}}();RTree.Rectangle.squarified_ratio=function(b,c,d){var e=(b+c)/2;b*=c;return b*d/(b/(e*e))};var f=function(b,d,e){var f=[],g=[],j=[],v=1;if(!b||!RTree.Rectangle.overlap_rectangle(b,e))return j;b={x:b.x,y:b.y,w:b.w,h:b.h,target:d};g.push(e.nodes.length);f.push(e);do{e=f.pop();d=g.pop()-1;if("target"in
b)for(;d>=0;){var l=e.nodes[d];if(RTree.Rectangle.overlap_rectangle(b,l))if(b.target&&"leaf"in l&&l.leaf===b.target||!b.target&&("leaf"in l||RTree.Rectangle.contains_rectangle(l,b))){"nodes"in l?(j=h(l,!0,[],l),e.nodes.splice(d,1)):j=e.nodes.splice(d,1);RTree.Rectangle.make_MBR(e.nodes,e);delete b.target;if(e.nodes.length<c)b.nodes=h(e,!0,[],e);break}else if("nodes"in l)v+=1,g.push(d),f.push(e),e=l,d=l.nodes.length;d-=1}else if("nodes"in b){e.nodes.splice(d+1,1);e.nodes.length>0&&RTree.Rectangle.make_MBR(e.nodes,
e);for(d=0;d<b.nodes.length;d++)i(b.nodes[d],e);b.nodes.length=0;f.length==0&&e.nodes.length<=1?(b.nodes=h(e,!0,b.nodes,e),e.nodes.length=0,f.push(e),g.push(1)):f.length>0&&e.nodes.length<c?(b.nodes=h(e,!0,b.nodes,e),e.nodes.length=0):delete b.nodes}else RTree.Rectangle.make_MBR(e.nodes,e);v-=1}while(f.length>0);return j},h=function(b,c,e,d){var f=[];if(!RTree.Rectangle.overlap_rectangle(b,d))return e;f.push(d.nodes);do for(var d=f.pop(),g=d.length-1;g>=0;g--){var h=d[g];RTree.Rectangle.overlap_rectangle(b,
h)&&("nodes"in h?f.push(h.nodes):"leaf"in h&&(c?e.push(h):e.push(h.leaf)))}while(f.length>0);return e},i=function(b,d){var f;if(d.nodes.length==0)d.x=b.x,d.y=b.y,d.w=b.w,d.h=b.h,d.nodes.push(b);else{var g=-1,h=[],j;h.push(d);var i=d.nodes;do{if(g!=-1)h.push(i[g]),i=i[g].nodes,g=-1;for(var l=i.length-1;l>=0;l--){var s=i[l];if("leaf"in s){g=-1;break}var r=RTree.Rectangle.squarified_ratio(s.w,s.h,s.nodes.length+1),s=RTree.Rectangle.squarified_ratio(Math.max(s.x+s.w,b.x+b.w)-Math.min(s.x,b.x),Math.max(s.y+
s.h,b.y+b.h)-Math.min(s.y,b.y),s.nodes.length+2);if(g<0||Math.abs(s-r)<j)j=Math.abs(s-r),g=l}}while(g!=-1);g=b;do{if(f&&"nodes"in f&&f.nodes.length==0){j=f;f=h.pop();for(i=0;i<f.nodes.length;i++)if(f.nodes[i]===j||f.nodes[i].nodes.length==0){f.nodes.splice(i,1);break}}else f=h.pop();if("leaf"in g||"nodes"in g||Object.prototype.toString.call(g)==="[object Array]"){if(Object.prototype.toString.call(g)==="[object Array]"){for(j=0;j<g.length;j++)RTree.Rectangle.expand_rectangle(f,g[j]);f.nodes=f.nodes.concat(g)}else RTree.Rectangle.expand_rectangle(f,
g),f.nodes.push(g);if(f.nodes.length<=e)g={x:f.x,y:f.y,w:f.w,h:f.h};else{j=g=f.nodes;for(var i=j.length-1,l=0,r=j.length-1,s=0,o=void 0,t=void 0,o=j.length-2;o>=0;o--)t=j[o],t.x>j[l].x?l=o:t.x+t.w<j[i].x+j[i].w&&(i=o),t.y>j[s].y?s=o:t.y+t.h<j[r].y+j[r].h&&(r=o);Math.abs(j[i].x+j[i].w-j[l].x)>Math.abs(j[r].y+j[r].h-j[s].y)?i>l?(o=j.splice(i,1)[0],t=j.splice(l,1)[0]):(t=j.splice(l,1)[0],o=j.splice(i,1)[0]):r>s?(o=j.splice(r,1)[0],t=j.splice(s,1)[0]):(t=j.splice(s,1)[0],o=j.splice(r,1)[0]);for(j=[{x:o.x,
y:o.y,w:o.w,h:o.h,nodes:[o]},{x:t.x,y:t.y,w:t.w,h:t.h,nodes:[t]}];g.length>0;){for(var i=g,l=j[0],r=j[1],o=RTree.Rectangle.squarified_ratio(l.w,l.h,l.nodes.length+1),t=RTree.Rectangle.squarified_ratio(r.w,r.h,r.nodes.length+1),u=void 0,w=void 0,s=void 0,x=i.length-1;x>=0;x--){var y=i[x],z={};z.x=Math.min(l.x,y.x);z.y=Math.min(l.y,y.y);z.w=Math.max(l.x+l.w,y.x+y.w)-z.x;z.h=Math.max(l.y+l.h,y.y+y.h)-z.y;var z=Math.abs(RTree.Rectangle.squarified_ratio(z.w,z.h,l.nodes.length+2)-o),A={};A.x=Math.min(r.x,
y.x);A.y=Math.min(r.y,y.y);A.w=Math.max(r.x+r.w,y.x+y.w)-A.x;A.h=Math.max(r.y+r.h,y.y+y.h)-A.y;y=Math.abs(RTree.Rectangle.squarified_ratio(A.w,A.h,r.nodes.length+2)-t);if(!w||!u||Math.abs(y-z)<u)w=x,u=Math.abs(y-z),s=y<z?r:l}o=i.splice(w,1)[0];l.nodes.length+i.length+1<=c?(l.nodes.push(o),RTree.Rectangle.expand_rectangle(l,o)):r.nodes.length+i.length+1<=c?(r.nodes.push(o),RTree.Rectangle.expand_rectangle(r,o)):(s.nodes.push(o),RTree.Rectangle.expand_rectangle(s,o))}g=j;h.length<1&&(f.nodes.push(j[0]),
h.push(f),g=j[1])}}else RTree.Rectangle.expand_rectangle(f,g),g={x:f.x,y:f.y,w:f.w,h:f.h}}while(h.length>0)}};this.get_tree=function(){return g};this.set_tree=function(b,c){c||(c=g);var d=c;d.nodes=b.nodes;d.x=b.x;d.y=b.y;d.w=b.w;d.h=b.h;return d};this.search=function(){if(arguments.length<1)throw"Wrong number of arguments. RT.Search requires at least a bounding rectangle.";switch(arguments.length){case 1:arguments[1]=!1;case 2:arguments[2]=[];case 3:arguments[3]=g;default:arguments.length=4}return h.apply(this,
arguments)};this.toJSON=function(b,c){var e=[],f=[],h={},i=3,v=1,l="";if(b&&!RTree.Rectangle.overlap_rectangle(b,g))return"";c?(i+=4,f.push(c.nodes.length),e.push(c.nodes),l+="var main_tree = {x:"+c.x.toFixed()+",y:"+c.y.toFixed()+",w:"+c.w.toFixed()+",h:"+c.h.toFixed()+",nodes:["):(f.push(g.nodes.length),e.push(g.nodes),l+="var main_tree = {x:"+g.x.toFixed()+",y:"+g.y.toFixed()+",w:"+g.w.toFixed()+",h:"+g.h.toFixed()+",nodes:[");do{var s=e.pop(),r=f.pop()-1;for(r>=0&&r<s.length-1&&(l+=",");r>=0;){var o=
s[r];if(!b||RTree.Rectangle.overlap_rectangle(b,o))if(o.nodes)if(v>=i){var t=d("saved_subtree");l+="{x:"+o.x.toFixed()+",y:"+o.y.toFixed()+",w:"+o.w.toFixed()+",h:"+o.h.toFixed()+",load:'"+t+".js'}";h[t]=this.toJSON(b,o);r>0&&(l+=",")}else l+="{x:"+o.x.toFixed()+",y:"+o.y.toFixed()+",w:"+o.w.toFixed()+",h:"+o.h.toFixed()+",nodes:[",v+=1,f.push(r),e.push(s),s=o.nodes,r=o.nodes.length;else o.leaf?(t=o.leaf.toJSON?o.leaf.toJSON():JSON.stringify(o.leaf),l+="{x:"+o.x.toFixed()+",y:"+o.y.toFixed()+",w:"+
o.w.toFixed()+",h:"+o.h.toFixed()+",leaf:"+t+"}",r>0&&(l+=",")):o.load&&(l+="{x:"+o.x.toFixed()+",y:"+o.y.toFixed()+",w:"+o.w.toFixed()+",h:"+o.h.toFixed()+",load:'"+o.load+"'}",r>0&&(l+=","));r-=1}r<0&&(l+="]}",v-=1)}while(e.length>0);l+=";";for(var u in h)l+="\nvar "+u+" = function(){"+h[u]+" return(main_tree);};";return l};this.remove=function(){if(arguments.length<1)throw"Wrong number of arguments. RT.remove requires at least a bounding rectangle.";switch(arguments.length){case 1:arguments[1]=
!1;case 2:arguments[2]=g;default:arguments.length=3}if(arguments[1]===!1){var b=0,c=[];do b=c.length,c=c.concat(f.apply(this,arguments));while(b!=c.length);return c}else return f.apply(this,arguments)};this.insert=function(b,c){return i({x:b.x,y:b.y,w:b.w,h:b.h,leaf:c},g)}};
RTree.Rectangle=function(b,c,e,g){var d,f,h,i;b.x?(d=b.x,f=b.y,b.w!==0&&!b.w&&b.x2?(h=b.x2-b.x,i=b.y2-b.y):(h=b.w,i=b.h)):(d=b,f=c,h=e,i=g);this.x1=this.x=d;this.y1=this.y=f;this.x2=d+h;this.y2=f+i;this.w=h;this.h=i;this.toJSON=function(){return'{"x":'+d.toString()+', "y":'+f.toString()+', "w":'+h.toString()+', "h":'+i.toString()+"}"};this.overlap=function(b){return this.x()<b.x2()&&this.x2()>b.x()&&this.y()<b.y2()&&this.y2()>b.y()};this.expand=function(b){var c=Math.min(this.x(),b.x()),e=Math.min(this.y(),
b.y());h=Math.max(this.x2(),b.x2())-c;i=Math.max(this.y2(),b.y2())-e;d=c;f=e;return this};this.setRect=function(){}};RTree.Rectangle.overlap_rectangle=function(b,c){return b.x<c.x+c.w&&b.x+b.w>c.x&&b.y<c.y+c.h&&b.y+b.h>c.y};RTree.Rectangle.contains_rectangle=function(b,c){return b.x+b.w<=c.x+c.w&&b.x>=c.x&&b.y+b.h<=c.y+c.h&&b.y>=c.y};
RTree.Rectangle.expand_rectangle=function(b,c){var e=Math.min(b.x,c.x),g=Math.min(b.y,c.y);b.w=Math.max(b.x+b.w,c.x+c.w)-e;b.h=Math.max(b.y+b.h,c.y+c.h)-g;b.x=e;b.y=g;return b};RTree.Rectangle.make_MBR=function(b,c){if(b.length<1)return{x:0,y:0,w:0,h:0};c?c.x=b[0].x:c={x:b[0].x,y:b[0].y,w:b[0].w,h:b[0].h};c.y=b[0].y;c.w=b[0].w;c.h=b[0].h;for(var e=b.length-1;e>0;e--)RTree.Rectangle.expand_rectangle(c,b[e]);return c};/*
 Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 See http://github.com/kothic/kothic-js for more information.
*/
Kothic.Debug=K.Class.extend({initialize:function(){this.stats={};this.events=[{message:"initialized",timestamp:+new Date}]},setStats:function(b){for(var c in b)b.hasOwnProperty(c)&&(this.stats[c]=b[c])},addEvent:function(b){this.events.push({message:b,timestamp:+new Date})}});/*
 Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 See http://github.com/kothic/kothic-js for more information.
*/
Array.prototype.remove=function(b){b=this.indexOf(b);b>=0&&(this.splice(b,1),delete this[b])};
