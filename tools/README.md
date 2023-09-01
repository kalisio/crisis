<img src="https://s3.eu-central-1.amazonaws.com/kalisioscope/crisis/crisis-icon-color-256x256.png" width="256">

## Crisis tools

This folder contains some useful scripts to manage application databases.

They are usually run through NodeJs like this `node <script.js> [options]`. You should not need to install anything as they rely on the already installed dev dependencies of the application.

Launch `node <script.js> --help` to get detailed information about the script usage/options.

### `clean-databases`

This script is used to remove all empty organisation databases found. It is useful to clean the databases after running some tests that did not correctly clean everything.

By default it will only output the databases to be processed in a file, you need to call it with the `--apply` option to delete the empty ones.

### `EventArchiving_MongoAtlas`

This script is a MongoDB Stitch Function to be used for events archiving, please follow this [link](https://docs.google.com/document/d/1h4LC6dWelImEHPQCMaksNwGh1lwlct9ncjSTL6_-vYA/edit?usp=sharing) for more information.

### `EventLogsArchiving_MongoAtlas`

This script is a MongoDB Stitch Function to be used for event logs archiving, please follow this [link](https://docs.google.com/document/d/1h4LC6dWelImEHPQCMaksNwGh1lwlct9ncjSTL6_-vYA/edit?usp=sharing) for more information.

### `PlanArchiving_MongoAtlas`

This script is a MongoDB Stitch Function to be used for plans archiving, please follow this [link](https://docs.google.com/document/d/1h4LC6dWelImEHPQCMaksNwGh1lwlct9ncjSTL6_-vYA/edit?usp=sharing) for more information.

### Exporting application users

mongoexport --uri mongodb+srv://<LOGIN>:<PASSWORD>@URL/crisis --collection users --fields "email" --type csv --out crisis-users.csv

**Take care to use the same version of mongoexport than your DB server otherwise it might raise an error like `Failed to parse: xxx`**
