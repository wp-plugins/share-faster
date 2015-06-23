

SASS_FILES := $(wildcard *.scss)
TEMPLATES := $(wildcard templates/*.hbs)

TEMPLATE_JS_FILES := $(patsubst templates/%.hbs, templates/%.js, $(TEMPLATES))

release:
	cd .. && zip -r -o share-faster.zip share-faster

all: share-faster.css share-faster.js

.PHONY all: share-faster.css templates/
share-faster.css: $(SASS_FILES)
	compass compile --css-dir=./ --sass-dir=./

templates.js: $(TEMPLATE_JS_FILES)
	cat $^ > $@

share-faster.js: templates.js share.js
	cat $^ > $@

templates/%.js: templates/%.hbs
	handlebars -f $@ $^


watch:
	fswatch-run ./*.scss templates/*.hbs make

.PHONY css: share-faster.css
