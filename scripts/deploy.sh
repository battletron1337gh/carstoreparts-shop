#!/bin/bash
set -e

echo "Building carstoreparts.nl..."
npm run build

echo "Deploying to Hostinger..."
rsync -avz --progress \
  -e "ssh -i /home/battletron/.ssh/carstorecuijk_deploy~ -p 65002 -o StrictHostKeyChecking=no" \
  dist/ u258982067@194.36.187.37:~/domains/carstoreparts.nl/public_html/

echo "Done."
