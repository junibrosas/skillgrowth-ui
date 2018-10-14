#/bin/bash
#upload files
aws s3 cp ./dist/elearning-angular s3://cloud.elearning.com --recursive --acl public-read