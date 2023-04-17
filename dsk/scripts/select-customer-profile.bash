#!/bin/bash

function usage {
	echo "usage: $0 [profile] [customer_id] [api_gateway_url] [setup|teardown]"
	echo "example: $0 partner 1654077511544 https//s0m3ugly.aws.api/Prod/context" setup
}

if [ "$#" -ne 4 ]; then
    usage
    exit
fi

AWS_PROFILE=$1
CUSTOMER_ID=$2
API_GATEWAY_URL=$3
ACTION=$4

SQL="SELECT profile_document FROM customer_profile WHERE customer_id = '$CUSTOMER_ID'"

echo "Getting AWS account ID for $AWS_PROFILE..."
NUMERIC_AWS_ACCT_ID=`aws sts get-caller-identity --query Account --output text --profile $AWS_PROFILE`

echo "Getting Aurora Secret for $AWS_PROFILE ($NUMERIC_AWS_ACCT_ID)..."
AURORA_SECRET_ARN=`aws --profile $AWS_PROFILE secretsmanager get-secret-value --secret-id $AWS_PROFILE/aurora/postgres | jq -r '.ARN'`

# Below breaks when there is more than one aurora cluster
echo "Getting Aurora Cluster ARN for $AWS_PROFILE ($NUMERIC_AWS_ACCT_ID)..."
#AURORA_CLUSTER=`aws rds describe-db-clusters --profile $AWS_PROFILE | jq -r '.DBClusters|.[]|.DBClusterIdentifier'`
AURORA_CLUSTER=`aws rds describe-db-clusters --profile $AWS_PROFILE | jq -r '.DBClusters|.[]|.DBClusterIdentifier' | grep $AWS_PROFILE` #attempt to target single correct cluster identifier
AURORA_COUNT=`echo $AURORA_CLUSTER | tr " " "\n" | wc -l | sed 's/ //g'`
if [ $AURORA_COUNT -ne 1 ]
then
    echo "ERROR: More than one aurora account found -> $AURORA_COUNT"
fi
RESOURCE_ARN=arn:aws:rds:us-east-1:$NUMERIC_AWS_ACCT_ID:cluster:$AURORA_CLUSTER

echo "Calling aws rds-data execute-statement --secret-arn $AURORA_SECRET_ARN --database tenovos --resource-arn $RESOURCE_ARN --schema public --sql "$SQL" --profile $AWS_PROFILE"

# Shamefully assume it executed and worked
RESULT=`aws rds-data execute-statement --secret-arn $AURORA_SECRET_ARN --database tenovos --resource-arn $RESOURCE_ARN --schema public --sql "$SQL" --profile $AWS_PROFILE`

PROFILE_DOC=`echo $RESULT | jq '.records | .[] | .[] | .stringValue'`
echo $PROFILE_DOC > profile-doc.json

node src/setup.js "$API_GATEWAY_URL" $ACTION

