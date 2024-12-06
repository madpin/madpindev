docker run --rm \
  --name madpindev \
  -v ${PWD}:/src \
  -v ${HOME}/hugo_cache:/tmp/hugo_cache \
  -u 1002:1002 \
  -p 1313:1313 \
  hugomods/hugo:exts-non-root \
  server -t  hugo-theme-cleanwhite
