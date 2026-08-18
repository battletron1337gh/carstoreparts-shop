#!/bin/bash
set -e

# TODO: vul je eigen Hostinger SSH-gegevens in.
# Dit is NIET hetzelfde account als waar carstorecuijk.nl op staat.
SSH_KEY="/home/battletron/.ssh/JOUW_HOSTINGER_SSH_KEY"
SSH_HOST="JOUW_HOSTINGER_IP"
SSH_PORT="65002"
SSH_USER="JOUW_HOSTINGER_USER"
REMOTE_PATH="~/domains/carstoreparts.nl/public_html/"

echo "Building carstoreparts.nl..."
npm run build

echo "Deploying to Hostinger ($REMOTE_PATH)..."
rsync -avz --progress \
  -e "ssh -i $SSH_KEY -p $SSH_PORT -o StrictHostKeyChecking=no" \
  dist/ "$SSH_USER@$SSH_HOST:$REMOTE_PATH"

echo "Done."
