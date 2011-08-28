all:    clean dist/kothic.js
clean:
	rm -f dist/kothic.js

dist/kothic-compact.js:
	java -jar lib/closure-compiler/compiler.jar \
        --js debug/leaflet/leaflet.js \
        --js dist/kothic-leaflet.js \
		--js src/core/utils.js \
		--js src/core/class.js \
        --js src/kothic.js \
        --js src/canvas/canvasproxy.js \
        --js src/canvas/path.js \
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
        --js src/utils/utils.js \
        --js src/utils/rtree.js \
        --manage_closure_dependencies \
        --js_output_file dist/kothic-compact.js \
        --compilation_level ADVANCED_OPTIMIZATIONS


dist/kothic.js:
	java -jar lib/closure-compiler/compiler.jar \
		--js src/core/utils.js \
		--js src/core/class.js \
        --js src/kothic.js \
        --js src/canvas/canvasproxy.js \
        --js src/canvas/path.js \
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
        --js src/utils/utils.js \
        --js src/utils/rtree.js \
        --manage_closure_dependencies \
		--js_output_file dist/kothic.js
