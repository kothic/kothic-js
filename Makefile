dist/kothic.js: Makefile
	java -jar lib/closure-compiler/compiler.jar \
        --js src/canvas/canvasproxy.js \
        --js src/canvas/path.js \
        --js src/kothic.js \
        --js src/renderer/line.js \
        --js src/renderer/polygon.js \
        --js src/renderer/renderer.js \
        --js src/renderer/shields.js \
        --js src/renderer/text.js \
        --js src/renderer/texticons.js \
        --js src/style/mapcss.js \
        --js src/style/style.js \
        --js src/utils/collisions.js \
        --js src/utils/geomops.js \
        --js src/utils/rtree.js \
        --js src/utils/utils.js \
		--js_output_file dist/kothic.js
