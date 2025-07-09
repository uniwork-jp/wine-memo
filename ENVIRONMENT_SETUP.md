# Environment Setup Guide

## Quick Setup

1. **Create `.env.local` file** in `apps/user-ui/` directory
2. **Copy the template below** into the file
3. **Replace placeholder values** with your Firebase configuration
4. **Restart the development server**

## .env.local Template

```bash
# Firebase Client Configuration (for browser-side operations)
# Get these values from Firebase Console > Project Settings > General > Your apps > Web app
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=wine-memo-465402.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=wine-memo-465402
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=wine-memo-465402.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id_here

# Firebase Admin Configuration (for server-side operations)
# Get these values from Firebase Console > Project Settings > Service accounts > Generate new private key
FIREBASE_PROJECT_ID=wine-memo-465402
FIREBASE_CLIENT_EMAIL=your_service_account_email@wine-memo-465402.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_private_key_content_here\n-----END PRIVATE KEY-----\n"
```

## Step-by-Step Instructions

### 1. Get Client-Side Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `wine-memo-465402`
3. Click the gear icon ⚙️ (Project Settings)
4. Scroll down to "Your apps" section
5. Click on your web app (or create a new one)
6. Copy the configuration values from the code snippet

### 2. Get Server-Side Firebase Configuration

1. In Firebase Console, go to Project Settings ⚙️
2. Click "Service accounts" tab
3. Click "Generate new private key" button
4. Download the JSON file
5. Open the JSON file and copy these values:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

### 3. Create the Environment File

1. Navigate to `apps/user-ui/` directory
2. Create a new file called `.env.local`
3. Copy the template above
4. Replace all placeholder values with your actual Firebase configuration

### 4. Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart it
cd apps/user-ui
pnpm dev
```

## File Structure

```
wine-memo/
├── apps/
│   └── user-ui/
│       ├── .env.local          ← Create this file here
│       ├── app/
│       ├── components/
│       └── package.json
└── packages/
    └── firebase/
```

## Verification

After setting up the environment variables:

1. **Check console logs** - You should see Firebase initialization messages
2. **Test wine creation** - Try creating a wine record through the UI
3. **Check API endpoint** - Visit `/api/wine/create` to test the server-side Firebase

## Troubleshooting

### Common Issues:

1. **"Firebase not initialized" error**
   - Check that all environment variables are set correctly
   - Ensure no extra spaces or quotes around values

2. **"auth/invalid-api-key" error**
   - Verify `NEXT_PUBLIC_FIREBASE_API_KEY` is correct
   - Check that the Firebase project is active

3. **"Service account not found" error**
   - Verify `FIREBASE_CLIENT_EMAIL` matches the service account
   - Ensure the service account has proper permissions

4. **Environment variables not loading**
   - Make sure the file is named exactly `.env.local`
   - Restart the development server after changes
   - Check that the file is in the correct location (`apps/user-ui/.env.local`)

### Debug Commands:

```bash
# Check if environment variables are loaded
cd apps/user-ui
node -e "console.log('API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Set' : 'Missing')"
```

## Security Notes

- Never commit `.env.local` to version control
- The file is already in `.gitignore`
- Keep your Firebase private key secure
- Rotate keys regularly for production environments 