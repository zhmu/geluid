#!/bin/sh
echo "use 'yarn serve' to run the app"
docker run --rm -it -p 8080:8080 -v `pwd`:/backend geluid /bin/sh
