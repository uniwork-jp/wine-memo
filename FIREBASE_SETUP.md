# Firebase Setup Guide

This project requires Firebase configuration for both client-side and server-side operations.

## Required Environment Variables

Create a `.env.local` file in the `apps/user-ui/` directory with the following variables:

### Client-Side Firebase Configuration (for browser)
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=wine-memo-465402.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=wine-memo-465402
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=wine-memo-465402.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

### Server-Side Firebase Admin Configuration
```
FIREBASE_PROJECT_ID=wine-memo-465402
FIREBASE_CLIENT_EMAIL=your_service_account_email_here
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

## How to Get These Values

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `wine-memo-465402`
3. **For Client Configuration**:
   - Go to Project Settings (gear icon)
   - Scroll down to "Your apps" section
   - Click on the web app or create a new one
   - Copy the configuration values

4. **For Server Configuration**:
   - Go to Project Settings (gear icon)
   - Go to "Service accounts" tab
   - Click "Generate new private key"
   - Download the JSON file
   - Use the values from the JSON file:
     - `project_id` → `FIREBASE_PROJECT_ID`
     - `client_email` → `FIREBASE_CLIENT_EMAIL`
     - `private_key` → `FIREBASE_PRIVATE_KEY`

## Current Status

The application has been updated to handle missing environment variables gracefully:
- Client-side Firebase will show warnings if not configured
- Server-side Firebase will show warnings if not configured
- The app will still run but Firebase operations will fail

## Testing

After setting up the environment variables:
1. Restart your development server
2. Try creating a wine record
3. Check the console for any Firebase-related errors

## Troubleshooting

If you see Firebase errors:
1. Verify all environment variables are set correctly
2. Check that the Firebase project exists and is accessible
3. Ensure the service account has the necessary permissions
4. Restart the development server after making changes 