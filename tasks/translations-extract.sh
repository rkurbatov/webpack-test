#!/bin/bash

# Extracts all translatable scripts from templates and sources
# for further Transifex translation

OUTPUT_FILE=./translations/extracted-strings.pot

# gettext-extract is used for extraction from PUG (JADE) or HTML templates
find ./app -name '*.pug' -o -name '*.jade' -o -name '*.html' | xargs gettext-extract --output $OUTPUT_FILE

# default xgettext is used for JavaScript files
# BSD xargs doesn't have --no-run-if-empty we use 'grep .' instead
find ./app -name '*.js' | grep . | xargs xgettext -join-existing --output=$OUTPUT_FILE