#!/bin/bash

# Deploy Firebase Functions
echo "Building and deploying Firebase Functions..."

# Install dependencies
npm install

# Build TypeScript
npm run build

# Deploy functions
firebase deploy --only functions

echo "Firebase Functions deployment completed!" 