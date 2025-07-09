# Firebase/Firestore Terraform Configuration

This directory contains Terraform configuration files to set up Firebase and Firestore for the Wine Memo application.

## Prerequisites

1. **Google Cloud Project**: You need a Google Cloud Project with billing enabled
2. **Terraform**: Install Terraform (version >= 1.0)
3. **Google Cloud CLI**: Install and authenticate with `gcloud auth application-default login`
4. **Required APIs**: The Terraform configuration will automatically enable the required APIs

## Configuration

1. **Copy the example variables file**:
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

2. **Update the variables** in `terraform.tfvars`:
   ```hcl
   project_id         = "your-google-cloud-project-id"
   region             = "asia-northeast1"
   firestore_location = "asia-northeast1"
   environment        = "dev"
   ```

## Deployment

1. **Initialize Terraform**:
   ```bash
   terraform init
   ```

2. **Plan the deployment**:
   ```bash
   terraform plan
   ```

3. **Apply the configuration**:
   ```bash
   terraform apply
   ```

4. **Review the outputs** to get important information like project ID and database details.

## What Gets Created

- **Firebase Project**: A new Firebase project in your Google Cloud Project
- **Firestore Database**: A native Firestore database in Tokyo (asia-northeast1)
- **Firestore Indexes**: Optimized indexes for the wines collection queries:
  - `createdAt` descending order (for listing wines)
  - Wine characteristics (sweetness, body, acidity, tannin, bitterness)
  - Region and grape variety combinations
  - Rating-based queries
  - Vintage-based queries

## Security Rules

The `firestore.rules` file contains basic security rules that:
- Allow authenticated users to read all wines
- Allow authenticated users to create, update, and delete wines
- Deny all other access by default

**Note**: You may want to customize these rules based on your specific requirements, such as user ownership of wine entries.

## Environment Variables

After deployment, you'll need to set the following environment variables in your application:

### For Client-side (Next.js public variables):
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### For Server-side (Admin SDK):
```
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY=your_private_key
```

## Getting Firebase Configuration

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > General
4. Scroll down to "Your apps" section
5. Add a web app if you haven't already
6. Copy the configuration values

## Getting Service Account Key

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > Service Accounts
4. Click "Generate new private key"
5. Download the JSON file
6. Extract the required values for your environment variables

## Cleanup

To destroy all created resources:
```bash
terraform destroy
```

**Warning**: This will permanently delete your Firestore database and all data!

## Troubleshooting

### Common Issues

1. **API not enabled**: Make sure the required APIs are enabled in your Google Cloud Project
2. **Permission denied**: Ensure your Google Cloud account has the necessary permissions
3. **Location not available**: Check that the specified Firestore location is available for your project

### Useful Commands

- `terraform state list`: List all managed resources
- `terraform show`: Show the current state
- `terraform refresh`: Refresh the state from the cloud
- `terraform output`: Show all outputs

## Next Steps

After deploying the infrastructure:

1. Configure your application with the Firebase credentials
2. Deploy the Firestore security rules
3. Test your application's connection to Firestore
4. Consider setting up monitoring and alerting
5. Plan for production deployment with appropriate security measures 