# Wine Memo PWA Setup

This application has been configured as a Progressive Web App (PWA) to provide a native app-like experience on mobile and desktop devices.

## Features

### 🚀 PWA Capabilities
- **Installable**: Users can install the app on their home screen
- **Offline Support**: Basic offline functionality with service worker caching
- **App-like Experience**: Standalone mode without browser UI
- **Push Notifications**: Ready for future push notification implementation

### 📱 Mobile Optimized
- Responsive design for all screen sizes
- Touch-friendly interface
- Native app-like navigation
- Optimized for mobile performance

### 🎨 Visual Elements
- Custom wine-themed icons in multiple sizes
- Purple theme color (#8b5cf6) matching the wine theme
- App shortcuts for quick access to key features

## Installation

### For Users
1. Visit the app in a supported browser (Chrome, Edge, Safari, Firefox)
2. Look for the install prompt or use the browser's install option
3. The app will be added to your home screen/desktop
4. Launch the app like any other installed application

### For Developers

#### Prerequisites
```bash
pnpm install
```

#### Generate Icons
```bash
pnpm run generate-icons
```

#### Development
```bash
pnpm run dev
```

#### Production Build
```bash
pnpm run build
pnpm run start
```

## PWA Components

### PWAInstallPrompt
- Shows install prompt when the app is installable
- Handles user interaction for installation
- Automatically dismisses after installation

### PWAStatus
- Shows installation status
- Displays online/offline status
- Only visible when app is installed

## Configuration Files

### manifest.json
- App metadata and configuration
- Icon definitions
- Theme colors
- App shortcuts

### sw.js
- Service worker for offline functionality
- Caching strategies
- Push notification handling

### next.config.js
- PWA plugin configuration
- Service worker settings
- Build optimizations

## Browser Support

- ✅ Chrome (Android & Desktop)
- ✅ Edge (Windows)
- ✅ Safari (iOS & macOS)
- ✅ Firefox (Android & Desktop)
- ⚠️ Samsung Internet (Android)

## Testing PWA Features

### Installation
1. Open Chrome DevTools
2. Go to Application tab
3. Check "Manifest" section
4. Verify "Service Workers" registration

### Offline Testing
1. Open DevTools
2. Go to Network tab
3. Check "Offline" checkbox
4. Refresh the page to test offline functionality

### Lighthouse Audit
1. Open DevTools
2. Go to Lighthouse tab
3. Run PWA audit
4. Check for any issues

## Customization

### Icons
- Edit `scripts/generate-icons.js` to modify the SVG
- Run `pnpm run generate-icons` to regenerate all sizes
- Icons are stored in `public/icons/`

### Theme Colors
- Update `manifest.json` theme_color
- Update `layout.tsx` metadata themeColor
- Update icon colors in the SVG

### App Shortcuts
- Modify shortcuts array in `manifest.json`
- Add new routes and corresponding shortcuts

## Troubleshooting

### Installation Not Working
- Ensure HTTPS is enabled (required for PWA)
- Check browser compatibility
- Verify manifest.json is accessible

### Icons Not Loading
- Run `pnpm run generate-icons`
- Check file paths in manifest.json
- Verify icon files exist in public/icons/

### Service Worker Issues
- Clear browser cache
- Unregister old service workers in DevTools
- Check service worker registration in console

## Future Enhancements

- [ ] Background sync for offline data
- [ ] Push notifications for wine reminders
- [ ] Advanced caching strategies
- [ ] Offline-first data storage
- [ ] App updates notifications 