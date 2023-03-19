#!/bin/sh

set -e
TIMESTAMP=$(date +%Y/%m/%d_%H-%M-%S)
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)
IMAGE_TAG="naris-auth-${TIMESTAMP}"

export SCRIPT_DIR=$SCRIPT_DIR;
echo "${GREEN}SCRIPT_DIR${NC} = $SCRIPT_DIR";

echo "\n${GREEN}Start build service${NC}"
npx nx build auth;
echo "\n${GREEN}Finished build service${NC}"

echo "\n${GREEN}Start build image${NC}"
echo "\n${GREEN}IMAGE_TAG ==> ${IMAGE_TAG}\n${GREEN}"

if !(docker build -t="$IMAGE_TAG" -f ./apps/auth/Dockerfile .); then
   echo "\n${RED}Failed build image${NC}"
fi

echo "\n${GREEN}Finished build image${NC}"
