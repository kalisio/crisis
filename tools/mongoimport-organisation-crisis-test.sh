#set -x
# First two args are username / password for connecting
# Third arg is target organisation ID
# This script assumes you have forwarded the remote MongoDB to port 27018
organisation=$3
uri=mongodb://$1:$2@localhost:27018
uriCrisis=$uri/crisis
files=(mongodump/$organisation/*.json)
for file in "${files[@]}"; do
  basename="${file##*/}"
  collection="${basename%.*}"
  # Specific case of global collections
  if [[ "$collection" == "users" || "$collection" == "organisations" ]]; then
    echo Importing in global $collection
    mongoimport --verbose --uri=$uriCrisis --collection=$collection --file=mongodump/$organisation/$collection.json
  else
    echo Importing in organisation $collection
    mongoimport --verbose --uri=$uri --authenticationDatabase=crisis --db=$organisation --collection=$collection --file=mongodump/$organisation/$collection.json
  fi
done
