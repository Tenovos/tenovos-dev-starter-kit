#!/bin/bash

# Configures AWS profiles for jenkins-ecs agents
# Uses tenovos-iam-policies-JenkinsServiceRole from the source EcsContainer
# This avoids using keys for credentials and is necessary for scripts using --profile

# Add necessary AWS account ID's to jenkins-ecs-aws-account-ids in cicd Secrets Manager

accountIdJson=$1

declare -A accountIdArr="($(jq -r '. | to_entries | .[] |
    "[\"" + .key + "\"]=" + (.value | @sh)' <<< "$accountIdJson"))"

for ACCOUNT in "${!accountIdArr[@]}"
do
    echo "Setting AWS profile for $ACCOUNT"

    aws configure set profile.$ACCOUNT.region us-east-1
    aws configure set profile.$ACCOUNT.role_arn arn:aws:iam::${accountIdArr[$ACCOUNT]}:role/tenovos-iam-policies-JenkinsServiceRole
    aws configure set profile.$ACCOUNT.credential_source EcsContainer
done

echo "Done setting AWS profiles"
