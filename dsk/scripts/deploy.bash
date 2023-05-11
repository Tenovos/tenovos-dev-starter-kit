#!/bin/bash -e

display_usage() {
  echo "usage: $0 [deploy-environment] [customerId] [customerName] [disambiguator] [core-platform-environment] [setup|teardown] [admin-user-id] [create-metadata-artifacts] [local|jenkins] [create-event] [deploy-bucket] [customer-bucket] [SAFE|UNSAFE]"
  echo "example: $0 [integ-partner] [CUSTOMER ID] [CUSTOMER] [test] [partner] [setup] [some-uuid] [yes] [local] [yes] [partner-integ-deployment-bucket][some-customer-bucket] [SAFE]"
  echo "NOTE: this requires you to have AWS profiles set up that match the input for 'environment'"
}

echo "Command arguments: $@"

CURRENT_DIR=`basename "$PWD"`
if [ "x$CURRENT_DIR" = "xdsk" ]
then
  echo "Current directory is [$CURRENT_DIR]..."
else
  cd dsk
  CURRENT_DIR=`basename "$PWD"`
  if [ "x$CURRENT_DIR" = "xdsk" ]
  then
    echo "Current directory is [$CURRENT_DIR]..."
  else
    echo "Could not get to directory is [$CURRENT_DIR]..."
    exit;
  fi
fi

if [ $# -le 12 ]
then
  display_usage
  exit 1
fi

if [ $1 == '-h' ]
then
  display_usage
  exit 1
fi

if [ "$9" = "jenkins" ]
then
  # Declare source profile for npm
  . ~/.profile
fi

# set up key variables
ENVIRONMENT=$1
CUSTOMER_ID=$2
CUSTOMER_NAME=$3
GIT_COMMIT_SHA=`git rev-parse HEAD`
BRANCH_NAME=`git log -n 1 --pretty=%d HEAD | awk -F/ '{print $2}' | awk -F\) '{print $1}' | awk -F, '{print $1}'`
DISAMBIGUATOR=$4
CORE_PLATFORM_ENVIRONMENT=$5
ACTION=$6
ADMIN_USER_ID=$7
CREATE_METADATA=$8
CREATE_EVENT=${10}
DEPLOY_BUCKET=${11}
CUSTOMER_BUCKET=${12}
SAFE_OR_UNSAFE=${13}
STACK_NAME=dsk-$CUSTOMER_ID-$CUSTOMER_NAME-$DISAMBIGUATOR

# double check we want to proceed
if [ "$SAFE_OR_UNSAFE" = "UNSAFE" ]
then
    echo "UNSAFE mode...";
else
  read -p "About to [$ACTION] [$STACK_NAME] for [$ENVIRONMENT] against core platform account [$CORE_PLATFORM_ENVIRONMENT], continue (y/n)?" CHOICE
  if [ "$CHOICE" = "y" ]; then
    echo "Continuing...";
  else
    echo "Not continuing..."; exit 1;
  fi
fi

echo "Getting AWS account ID for $ENVIRONMENT..."
NUMERIC_AWS_ACCT_ID=`aws sts get-caller-identity --query Account --output text --profile $ENVIRONMENT`

echo "Getting environment name..."
CORE_PLATFORM_ENVIRONMENT_NAME=`aws ssm get-parameters --names "/config/env/alias" --profile $CORE_PLATFORM_ENVIRONMENT | jq -r '.Parameters|.[]|.Value'`
echo "Environment name is $CORE_PLATFORM_ENVIRONMENT_NAME"

if [ "x$CORE_PLATFORM_ENVIRONMENT_NAME" = "x" ]
then
  echo "ERROR: environment name not found"
  exit 1
fi

TEMPLATE_IMPORT_BUCKET="tenovos-export-metadata-config-$CORE_PLATFORM_ENVIRONMENT_NAME"
echo "Uploading metadata templates to s3 bucket [$TEMPLATE_IMPORT_BUCKET] at location [$STACK_NAME]"
ASSET_LOC_TEMPLATE="s3://$TEMPLATE_IMPORT_BUCKET/$STACK_NAME/asset-localization-template.json"

# Metadata Required for Feature
aws s3 cp config/asset-localization-template.json $ASSET_LOC_TEMPLATE --profile $CORE_PLATFORM_ENVIRONMENT

# Copy fonts to customer bucket for use with feature
#SAVEIFS=$IFS
#IFS=$(echo -en "\n\b")
#for font in `ls fonts`
#do
#  aws s3 cp "fonts/$font" $CUSTOMER_BUCKET --profile uat-enterprise-mt
#done
#IFS=$SAVEIFS

SECRET_POLICY_STRING="{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":{\"AWS\":[\"arn:aws:sts::$NUMERIC_AWS_ACCT_ID:assumed-role/dsk-role-$CUSTOMER_ID-$CUSTOMER_NAME-$DISAMBIGUATOR/dsk-handler-function-$CUSTOMER_ID-$CUSTOMER_NAME-$DISAMBIGUATOR\",\"arn:aws:sts::$NUMERIC_AWS_ACCT_ID:assumed-role/dsk-role-$CUSTOMER_ID-$CUSTOMER_NAME-$DISAMBIGUATOR/dsk-proxy-function-$CUSTOMER_ID-$CUSTOMER_NAME-$DISAMBIGUATOR\",\"arn:aws:sts::$NUMERIC_AWS_ACCT_ID:assumed-role/dsk-role-$CUSTOMER_ID-$CUSTOMER_NAME-$DISAMBIGUATOR/dsk-proxyasync-function-$CUSTOMER_ID-$CUSTOMER_NAME-$DISAMBIGUATOR\"]},\"Action\":\"secretsmanager:GetSecretValue\",\"Resource\":\"*\"}]}"

# should make smarter and only do where needed
echo "Running npm i"
npm i 

if [ "$ACTION" = "setup" ]
then
  # backup original template yaml
  echo "Backing up original cloudformation template"
  sleep 1
  pwdesc=$(echo "$PWD")
  cp "$pwdesc/template.yml" "$pwdesc/template-backup.yml"

  if [ "$9" = "jenkins" ]
  then
    # updating template.yml
    echo "Updating template yml with parameters"
    sleep 1
    sed -i "s/_CUSTOMERID_/$CUSTOMER_ID/g" "template.yml" 
    echo "Set customer ID to $CUSTOMER_ID"
    sleep 1
    sed -i "s/_CUSTOMERNAME_/$CUSTOMER_NAME/g" "template.yml"
    echo "Set customer name to $CUSTOMER_NAME"
    sleep 1
    sed -i "s/_DISAMBIGUATOR_/$DISAMBIGUATOR/g" "template.yml"
    echo "Set disambiguator to $DISAMBIGUATOR"
    sleep 1
    sed -i "s/_PUBLISHING_ACCOUNT_/$CORE_PLATFORM_ENVIRONMENT_NAME/g" "template.yml"
    echo "Set publishing account to $CORE_PLATFORM_ENVIRONMENT_NAME"
  else
    # updating template.yml
    echo "Updating template yml with parameters"
    #added the empty string after the -i flag in all of these sed statement as I was getting sed Undefined label errors -per https://stackoverflow.com/questions/12272065/sed-undefined-label-on-macos
    sleep 1
    sed -i '' "s/_CUSTOMERID_/$CUSTOMER_ID/g" "template.yml" 
    echo "Set customer ID to $CUSTOMER_ID"
    sleep 1
    sed -i '' "s/_CUSTOMERNAME_/$CUSTOMER_NAME/g" "template.yml"
    echo "Set customer name to $CUSTOMER_NAME"
    sleep 1
    sed -i '' "s/_DISAMBIGUATOR_/$DISAMBIGUATOR/g" "template.yml"
    echo "Set disambiguator to $DISAMBIGUATOR"
    sleep 1
    sed -i '' "s/_PUBLISHING_ACCOUNT_/$CORE_PLATFORM_ENVIRONMENT_NAME/g" "template.yml"
    echo "Set publishing account to $CORE_PLATFORM_ENVIRONMENT_NAME"
  fi

  sleep 1
  echo "Packaging..."
  # cust uat -> tenovos-integ-uat-services-workspace | integ-uat
  # partner -> partner-integ-deployment | integ-partner   
  sam package --template-file template.yml --output-template-file serverless-output-x.yml --s3-bucket $DEPLOY_BUCKET --profile $ENVIRONMENT

  cat serverless-output-x.yml | grep -v DefinitionS3Location > serverless-output.yml
  rm serverless-output-x.yml

  echo "The new template with replacements is `cat serverless-output.yml`"

  #branch name not available in this pipeline in jenkins
  if [ "x$BRANCH_NAME" = "x" ]
  then
    BRANCH_NAME=main
  fi

  echo "Deploying...with tags git sha [--tags "tnvs:services:delivery:git-commit-sha=$GIT_COMMIT_SHA" "tnvs:services:delivery:jenkins-build-num=N/A" "tnvs:services:delivery:branch=$BRANCH_NAME" "tnvs:services:delivery:jenkins-job-name=N/A" "tnvs:services:delivery:environment=$ENVIRONMENT" "tnvs:services:delivery:customer-id=$CUSTOMER_ID" "tnvs:services:delivery:customer-name=$CUSTOMER_NAME" "customerId=$CUSTOMER_ID"]..."
  aws cloudformation deploy --stack-name $STACK_NAME --template-file serverless-output.yml  \
                            --profile $ENVIRONMENT \
                            --capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
                            --region us-east-1 \
                            --s3-bucket tenovos-cicd \
                            --no-fail-on-empty-changeset \
                            --tags "tnvs:services:delivery:git-commit-sha=$GIT_COMMIT_SHA" "tnvs:services:delivery:jenkins-build-num=N/A" "tnvs:services:delivery:branch=$BRANCH_NAME" "tnvs:services:delivery:jenkins-job-name=N/A" "tnvs:services:delivery:environment=$ENVIRONMENT" "tnvs:services:delivery:customer-id=$CUSTOMER_ID" "tnvs:services:delivery:customer-name=$CUSTOMER_NAME" "customerId=$CUSTOMER_ID"

  echo "Returning template yaml to original state"
  
  rm serverless-output.yml
  cp "$pwdesc/template.yml" "$pwdesc/template-last.yml" 

  cp "$pwdesc/template-backup.yml" "$pwdesc/template.yml"

  echo "Getting api gateway URL from stack deployment"
  API_GATEWAY_URL=`aws cloudformation describe-stacks --stack-name $STACK_NAME --profile $ENVIRONMENT | jq -r '.Stacks | .[] | .Outputs[] | select(.OutputKey == "ApiGatewayUrl").OutputValue'`

  echo "Got URL $API_GATEWAY_URL"
  echo "Updating customer profile with the events required for DSK to work"
  NEW_PROFILE_DOCUMENT=`scripts/select-customer-profile.bash $CORE_PLATFORM_ENVIRONMENT_NAME $CUSTOMER_ID "$API_GATEWAY_URL" setup | grep PROFILE_DOCUMENT |  cut -c 18-`

  if [ "$CREATE_EVENT" = "yes" ] 
  then
    if [ "x$NEW_PROFILE_DOCUMENT" != "x" ]
    then
      #echo "New profile document below $NEW_PROFILE_DOCUMENT"
      echo "Calling -> scripts/update-customer-profile.bash $CORE_PLATFORM_ENVIRONMENT_NAME $CUSTOMER_ID $NEW_PROFILE_DOCUMENT setup" 
      scripts/update-customer-profile.bash $CORE_PLATFORM_ENVIRONMENT_NAME $CUSTOMER_ID "$NEW_PROFILE_DOCUMENT"
    else
      echo "Database entry already exists...skipping..."
    fi
  else
    echo "NOT adding event to customer profile"
  fi

  echo "Create Metadata is set to [$CREATE_METADATA]..."
  if [ "$CREATE_METADATA" = "yes" ]
  then
    echo "Creating localization templates in tenant..."
    AWS_PROFILE=$CORE_PLATFORM_ENVIRONMENT node scripts/setup.js test create-metadata $CUSTOMER_ID $STACK_NAME $ADMIN_USER_ID
  fi

  export SECRET_NAME="$CUSTOMER_ID"_"$CORE_PLATFORM_ENVIRONMENT_NAME"_dsk
  echo "Secret name is [$SECRET_NAME]..."
  SECRET_OBJ=`aws secretsmanager list-secrets --profile $ENVIRONMENT | jq -r ".SecretList|.[]|select(.Name == env.SECRET_NAME)|.ARN"`
  if [ "x$SECRET_OBJ" = "x" ]
  then
    echo "Secret is missing. It will need to be added and the policy updated accordingly after deployment completes..."
  else
    echo "Secret is [$SECRET_OBJ]..."
    sleep 1
    echo "Secret policy string is [$SECRET_POLICY_STRING]..."
    sleep 1
    echo "Updating secret with policy..."
    aws secretsmanager put-resource-policy --secret-id "$SECRET_OBJ" --resource-policy "$SECRET_POLICY_STRING" --profile $ENVIRONMENT
  fi
elif [ "$ACTION" = "teardown" ]
then
  echo "Updating customer profile to remove DSK event"
  NEW_PROFILE_DOCUMENT=`scripts/select-customer-profile.bash $CORE_PLATFORM_ENVIRONMENT_NAME $CUSTOMER_ID "$API_GATEWAY_URL" teardown | grep PROFILE_DOCUMENT |  cut -c 18-`

  echo "New profile document below $NEW_PROFILE_DOCUMENT"
  echo "Calling -> scripts/update-customer-profile.bash $CORE_PLATFORM_ENVIRONMENT_NAME $CUSTOMER_ID $NEW_PROFILE_DOCUMENT"#  scripts/update-customer-profile.bash $CORE_PLATFORM_ENVIRONMENT_NAME $CUSTOMER_ID "$NEW_PROFILE_DOCUMENT" teardown
  scripts/update-customer-profile.bash $CORE_PLATFORM_ENVIRONMENT_NAME $CUSTOMER_ID "$NEW_PROFILE_DOCUMENT"
elif [ "$ACTION" = "test" ]
then
#  SECRET=`aws secretsmanager list-secrets --profile integ-partner | jq ".SecretList|.[]|select( .Name == \"$CUSTOMER_ID_dsk\" )"`
  export SECRET_NAME="$CUSTOMER_ID"_"$CORE_PLATFORM_ENVIRONMENT_NAME"_dsk
  echo "Secret name is [$SECRET_NAME]..."
  SECRET_OBJ=`aws secretsmanager list-secrets --profile $ENVIRONMENT | jq -r ".SecretList|.[]|select(.Name == env.SECRET_NAME)|.ARN"`
  if [ "x$SECRET_OBJ" = "x" ]
  then
    echo "Secret is missing. It will need to be added and the policy updated accordingly after deployment completes..."
  else
    echo "Secret is [$SECRET_OBJ]..."
    sleep 1
    echo "Secret policy string is [$SECRET_POLICY_STRING]..."
    sleep 1
    echo "Updating secret with policy..."
    aws secretsmanager put-resource-policy --secret-id "$SECRET_OBJ" --resource-policy "$SECRET_POLICY_STRING" --profile $ENVIRONMENT | jq -r ".SecretList|.[]|select(.Name == env.SECRET_NAME)|.ARN"
  fi
else
  echo "Invalid action, must be setup or teardown or test..."
fi

echo "Done in $(basename $PWD)!"

