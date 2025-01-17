#!/bin/bash

# A command that modifies the package.json of all workspaces that depdend on @ninja/ninja-auth-js to use a consistent version

workspaces=$(yarn -s workspaces info | jq 'map(..|objects|select(.location).location)[1:] | @sh' | tr -d \'\")

# project directory
pdir=$(cd -- "$( dirname -- "${BASH_SOURCE[0]}" )/../.." &> /dev/null && pwd)

for loc in $workspaces
do
  echo $loc
  json=$(cat $pdir/$loc/package.json |  jq --arg version $@ 'if .dependencies | has("@ninja/ninja-auth-js") then .dependencies["@ninja/ninja-auth-js"] = $version else . end') && \
  echo -E "${json}" > "$pdir/$loc/package.json"
done
