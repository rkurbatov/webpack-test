#!/bin/bash

# Extracts all translatable scripts from templates and sources
# for further Transifex translation

OUTPUT_FILE=./translations/extracted-strings.pot

# gettext-extract is used for extraction from JADE (or HTML) templates
find ./app -name '*.jade' | xargs gettext-extract --output $OUTPUT_FILE

# default xgettext is used for JavaScript files
find ./app -name '*.js' | xargs --no-run-if-empty xgettext -join-existing --output=$OUTPUT_FILE