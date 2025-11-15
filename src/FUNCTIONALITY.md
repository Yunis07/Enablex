# EnableX App - Functionality Documentation

## Overview
EnableX is a comprehensive companion app designed for elderly and disabled users with accessibility-first features.

## Key Features Implemented

### 1. Settings Page (Separate Full-Page View)
- **Navigation**: Accessible from bottom navigation bar
- **Animation**: Slides in from the right (not a popup/modal)
- **Exit Button**: Fully functional X button in top-right corner
- **Layout**: Clean, structured, uniform content with proper spacing

### 2. User Profile Management
- **Name Input**: Users can set their display name (shown on home screen)
- **Phone Number**: For login and identification
- **Login/Logout**: Toggle functionality with visual feedback
- **Persistent Storage**: All data saved to localStorage

### 3. Multi-Language Support
All 6 languages with accurate translations:
- English (en)
- Tamil (ta) - தமிழ்
- Malayalam (ml) - മലയാളം
- Nepali (ne) - नेपाली
- Telugu (te) - తెలుగు
- Kannada (kn) - ಕನ್ನಡ

### 4. Customer Service Integration

#### Contact Numbers:
- +91908055820
- +918766284642

**Call Functionality**: 
- Click "Call" button opens phone dialer with number pre-filled
- Uses `tel:` protocol for direct calling

#### Email Addresses:
- yunisnainawasti.2501269@srec.ac.in
- taniya.2501251@srec.ac.in
- sahana.2501214@srec.ac.in
- rithekasree.2501204@srec.ac.in

**Email Functionality**:
- Click "Email" button opens default email client
- Pre-fills the email address using `mailto:` protocol
- Ready for user to compose and send message

#### Message Submission:
- **Text Area**: For typing issues or suggestions
- **Submit Button**: Sends message to ALL customer service contacts
- **Implementation**: Opens email client with:
  - All customer service emails in "To:" field
  - Subject: "EnableX Support Request"
  - Body: Pre-filled with user name, phone, and message
  - User can then send directly from their email client

### 5. Accessibility Features
- **Large Buttons**: Minimum 48px height for easy tapping
- **Bold Icons**: Stroke width of 3 for visibility
- **High Contrast**: Orange/blue color scheme with white backgrounds
- **Times New Roman Font**: Throughout the app for readability
- **Large Text**: 1.2rem minimum for elderly users
- **Minimal Text**: Clear, concise labels
- **Visual Feedback**: Hover effects, scale transforms, shadows

### 6. Design Principles
- **Clean UI/UX**: Uniform spacing and alignment
- **Card-Based Layout**: Each section in its own container
- **Consistent Padding**: 6px on mobile-friendly spacing
- **Rounded Corners**: xl (12px) borders for modern look
- **Shadow Hierarchy**: lg shadows for depth
- **Responsive**: Adapts to different screen sizes

## Technical Implementation

### Dependencies
All required libraries are properly imported:
- React 18.3.1
- Lucide-react (icons)
- Sonner 2.0.3 (toast notifications)
- Howler.js (audio notifications for medication)
- React Hook Form 7.55.0
- Radix UI components (for accessibility)
- Tailwind CSS 4.0

### Component Structure
```
App.tsx
├── LanguageProvider (Context)
├── Home Screen
│   ├── Header (greeting, user name)
│   ├── Main Cards (4 primary features)
│   ├── Upcoming Items (meds & tasks)
│   └── Bottom Navigation
└── Settings (Full Page)
    ├── User Profile Section
    ├── Language Settings Section
    └── Customer Service Section
        ├── Phone Numbers (with Call)
        ├── Email Addresses (with Email)
        └── Message Form (with Submit)
```

### State Management
- **Local State**: useState for component-level state
- **Context API**: LanguageContext for global language settings
- **LocalStorage**: Persistent data storage for:
  - User name
  - Phone number
  - Login status
  - Language preference
  - Medications
  - Tasks

### Animation Classes
Custom CSS animations in globals.css:
- `slide-in-from-right`: Settings page entrance
- `slide-in-from-bottom`: Card stagger animations
- `fade-in`: Modal backgrounds
- `zoom-in`: Modal content

## How To Use

### Opening Settings:
1. Click Settings icon in bottom navigation
2. Page slides in from right
3. Full-screen takeover (not a popup)

### Closing Settings:
1. Click X button in top-right
2. Or swipe/navigate back
3. Returns to home screen

### Calling Customer Service:
1. Open Settings
2. Scroll to Customer Service section
3. Click "Call" button next to any phone number
4. Phone dialer opens with number ready to call

### Emailing Customer Service:
1. Open Settings
2. Scroll to Email Addresses
3. Click "Email" button next to any address
4. Email client opens with address pre-filled
5. Compose and send your message

### Submitting Issues/Messages:
1. Open Settings
2. Scroll to "Send Message" section
3. Type your issue or suggestion in the text area
4. Click "Submit" button
5. Email client opens with ALL customer service contacts
6. Subject and body are pre-filled with your details
7. Click send in your email client to deliver the message

### Changing Language:
1. Open Settings
2. Scroll to Language Settings
3. Click on your preferred language
4. All text throughout the app updates instantly
5. Preference is saved automatically

## Future Enhancements Possible
- Backend API integration for direct message sending (without email client)
- SMS notifications
- Push notifications
- Voice commands
- Real-time caregiver communication
- Video call support
- Emergency auto-dial
