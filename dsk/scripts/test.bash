#!/bin/bash

RESULT=`curl https://4ud7zi9f01.execute-api.us-east-1.amazonaws.com/Prod/enter-path-here | jq -r '.message'`

if [[ x$RESULT = "xlambda executed" ]]
then
    echo "test succeeded"
else
    echo "test failed"
fi