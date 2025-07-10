#!/bin/bash

# Deploy Wine Memo Infrastructure
echo "Deploying Wine Memo infrastructure..."

# Deploy Firebase infrastructure
cd firebase
terraform init
terraform apply -auto-approve

# Deploy Firebase Functions
cd functions
chmod +x deploy.sh
./deploy.sh
cd ..

echo "Deployment completed!"
