<img src="https://s3.eu-central-1.amazonaws.com/kalisioscope/aktnmap/aktnmap-icon-256x256.png" width="256">

## Akt'n'Map tools

This folder contains some useful scripts to manage application databases.

They are usually run through NodeJs like this `node <script.js> [options]`. You should not need to install anything as they rely on the already installed dev dependencies of the application.

Launch `node <script.js> --help` to get detailed information about the script usage/options.

### `clean-sns`

This script is used to remove all unused SNS topics found, i.e. not part of an organisation database. It is useful to clean the topics after running some tests that did not correctly clean everything.

By default it will only output the topics to be deleted in a file, you need to call it with the `--apply` option to process with the deletion.

**Take care that if your data is split accross different application databases, like a local one for a development environment and a remote one on a staging environment, running the script can results in unexpected topics to be removed as it will only see part of the data**

### `clean-databases`

This script is used to remove all empty organisation databases found. It is useful to clean the databases after running some tests that did not correctly clean everything.

By default it will only output the databases to be processed in a file, you need to call it with the `--apply` option to delete the empty ones.

### `migrate-databases-0.7`

This script has been used to migrate database of previous version to the DB schema of v0.7. The main change was iOS support so that each group/tag/org must have two topic entries: ANDROID/IOS. They are actually the same because SNS take care of this but the way it is coded requires to duplicate the entry for now (see https://github.com/kalisio/kNotify/issues/22).

### `EventArchiving_MongoAtlas`

This script is a MongoDB Stitch Function to be used for events archiving, please follow this [link](https://docs.google.com/document/d/1h4LC6dWelImEHPQCMaksNwGh1lwlct9ncjSTL6_-vYA/edit?usp=sharing) for more information.

### `EventLogsArchiving_MongoAtlas`

This script is a MongoDB Stitch Function to be used for event logs archiving, please follow this [link](https://docs.google.com/document/d/1h4LC6dWelImEHPQCMaksNwGh1lwlct9ncjSTL6_-vYA/edit?usp=sharing) for more information.

### Exporting application users

mongoexport --uri mongodb+srv://<LOGIN>:<PASSWORD>@URL/aktnmap --collection users --fields "email" --type csv --out aktnmap-users.csv

**Take care to use the same version of mongoexport than your DB server otherwise it might raise an error like `Failed to parse: xxx`**
