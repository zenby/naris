#!/bin/sh

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)

export SCRIPT_DIR=$SCRIPT_DIR;
echo "${GREEN}SCRIPT_DIR${NC} = $SCRIPT_DIR";

echo "\n${GREEN}Start build service${NC}"
npx nx build auth;
echo "\n${GREEN}Finished build service${NC}"

echo "\n${GREEN}Start build image${NC}"

if !(docker build -t naris-auth -f ./apps/auth/Dockerfile .); then
   echo "\n${RED}Failed build image${NC}"
fi

echo "\n${GREEN}Finished build image${NC}"
