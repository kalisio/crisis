#set -x
# First two args are username / password for connecting
# Third arg is target organisation ID
organisation=$3
uri=mongodb+srv://$1:$2@prod.odbz7.mongodb.net
uriCrisis=$uri/aktnmap
uriOrganisation=$uri/$organisation
mkdir -p mongodump/$organisation
collections=$(mongosh $uriOrganisation --quiet --eval 'db.getCollectionNames().join(" ")')
for collection in $collections; do
  echo Exporting organisation collection $collection
  mongoexport --verbose --uri=$uriOrganisation --collection=$collection --out=mongodump/$organisation/$collection.json
done
echo Exporting organisation users from global collection
mongoexport --verbose --uri=$uriCrisis --collection=users --query "{ \"organisations\": { \"\$elemMatch\": { \"_id\": { \"\$oid\": \"${organisation}\" } } } }" --out=mongodump/$organisation/users.json
echo Exporting organisation from global collection
mongoexport --verbose --uri=$uriCrisis --collection=organisations --query "{ \"_id\": { \"\$oid\": \"${organisation}\" } }" --out=mongodump/$organisation/organisations.json
#set +x