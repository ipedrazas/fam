#!/usr/bin/env bash
# Every internal link in the built site must resolve to a file in dist/.
# Cheap, dependency-free, and it catches the one mistake that is easy to make here:
# renaming a past-event markdown file and forgetting what linked to it.
set -euo pipefail

missing=0
links=$(grep -rhoE 'href="/[^"#?]*"' dist --include='*.html' \
        | sed -E 's/href="([^"]*)"/\1/' | sort -u)

for path in $links; do
  case "$path" in
    /)   target="dist/index.html" ;;
    */)  target="dist${path}index.html" ;;
    *.*) target="dist$path" ;;
    *)   target="dist$path/index.html" ;;
  esac
  if [ ! -e "$target" ]; then
    echo "::error::Broken internal link: $path (expected $target)"
    missing=1
  fi
done

if [ "$missing" -ne 0 ]; then
  echo "Broken internal links found."
  exit 1
fi
echo "All internal links resolve. ($(echo "$links" | wc -l | tr -d ' ') checked)"
