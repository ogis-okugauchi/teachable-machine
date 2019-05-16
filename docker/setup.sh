#!/usr/bin/env bash

IMAGE=vantiq-demo/teachable-machine

if [ -z "$SCRIPT_DIR" ] ; then
	case $0 in
		/*)
			SCRIPT="$0"
			;;
		*)
			PWD=`pwd`
			SCRIPT="$PWD/$0"
			;;
	esac
    SCRIPT_DIR=$(cd $(dirname "$SCRIPT") && pwd)
    PROJECT_ROOT=$(dirname "$SCRIPT_DIR")
fi

docker build -t $IMAGE $SCRIPT_DIR
docker run --rm -p 3000:3000 -v $PROJECT_ROOT:/app -it $IMAGE
