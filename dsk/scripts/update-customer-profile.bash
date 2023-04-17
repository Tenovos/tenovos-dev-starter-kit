#!/bin/bash

function usage {
	echo "usage: $0 [profile] [customer_id] [profile_document]"
	echo "example: $0 partner 1654077511544 '{\"s0m3\": \"ugly-stringified-thing\"}'"
}

if [ "$#" -ne 3 ]; then
    usage
    exit
fi

AWS_PROFILE=$1
CUSTOMER_ID=$2
PROFILE_DOCUMENT=$3

SQL="UPDATE customer_profile SET profile_document = $PROFILE_DOCUMENT WHERE customer_id = '$CUSTOMER_ID'"

echo "Getting AWS account ID for $AWS_PROFILE..."
NUMERIC_AWS_ACCT_ID=`aws sts get-caller-identity --query Account --output text --profile $AWS_PROFILE`

echo "Getting Aurora Secret for $AWS_PROFILE ($NUMERIC_AWS_ACCT_ID)..."
AURORA_SECRET_ARN=`aws --profile $AWS_PROFILE secretsmanager get-secret-value --secret-id $AWS_PROFILE/aurora/postgres | jq -r '.ARN'`

# Below breaks when there is more than one aurora cluster
echo "Getting Aurora Cluster ARN for $AWS_PROFILE ($NUMERIC_AWS_ACCT_ID)..."
AURORA_CLUSTER=`aws rds describe-db-clusters --profile $AWS_PROFILE | jq -r '.DBClusters|.[]|.DBClusterIdentifier'`
RESOURCE_ARN=arn:aws:rds:us-east-1:$NUMERIC_AWS_ACCT_ID:cluster:$AURORA_CLUSTER

echo "Calling aws rds-data execute-statement --secret-arn $AURORA_SECRET_ARN --database tenovos --resource-arn $RESOURCE_ARN --schema public --sql \"$SQL\" --profile $AWS_PROFILE"

# Shamefully assume it executed and worked
RESULT=`aws rds-data execute-statement --secret-arn $AURORA_SECRET_ARN --database tenovos --resource-arn $RESOURCE_ARN --schema public --sql "$SQL" --profile $AWS_PROFILE`

echo "Done updating database with result [$RESULT]"



