build: html js

# css:
# 	node_modules/.bin/cssimport style/main.css ./ ./style ./style/font-awesome > style/main.min.css

html:
	node_modules/.bin/jade -O '{"prod": false}' index.jade

js:
	node_modules/.bin/browserify client_side/index.js -t jadeify -d -o main.js

clean:
	rm -f main.js index.html style/main.min.css

.PHONY: css, build, html, js, clean