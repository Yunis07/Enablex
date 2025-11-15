# EnableX App - Testing Guide

## Testing Checklist

### Settings Page Navigation ✅

#### Opening Settings:
1. Start the app (should see home screen with greeting)
2. Look at bottom navigation bar
3. Click the "Settings" button (rightmost icon)
4. **Expected**: Settings page should slide in from the right side
5. **Expected**: Page should cover the entire screen (not a popup)
6. **Expected**: Should see orange-red gradient header with "Settings" title

#### Closing Settings:
1. While Settings is open, look for the X button in top-right corner
2. Click the X button
3. **Expected**: Settings page should close/slide away
4. **Expected**: Should return to home screen
5. **Test Again**: Open and close Settings multiple times to verify consistency

### User Profile Section ✅

#### Saving Profile:
1. Open Settings
2. Scroll to "User Profile" section (first section)
3. Type your name in the "Your Name" field
4. Type a phone number in the "Phone Number" field
5. Click the blue "Save" button
6. **Expected**: Toast notification "Profile saved successfully!"
7. Close Settings and reopen
8. **Expected**: Your name and phone should still be there

#### Login/Logout:
1. Enter name and phone number
2. Click the green "Login" button
3. **Expected**: Button changes to red "Logout" button
4. **Expected**: Green confirmation bar appears: "Logged in as [Your Name]"
5. Click "Logout" button
6. **Expected**: Button changes back to green "Login"
7. **Expected**: Green confirmation bar disappears

#### Name Display on Home:
1. Save a name in Settings (e.g., "John")
2. Close Settings
3. Look at home screen header
4. **Expected**: Should say "Hello, John" instead of default name

### Language Settings ✅

#### Changing Language:
1. Open Settings
2. Scroll to "Language Settings" section
3. Current language should be highlighted in purple
4. Click on "தமிழ்" (Tamil) button
5. **Expected**: Toast notification "Language changed successfully!"
6. **Expected**: All text in Settings should change to Tamil
7. Close Settings
8. **Expected**: All text on home screen should be in Tamil
9. **Test all 6 languages**:
   - English ✓
   - தமிழ் (Tamil) ✓
   - മലയാളം (Malayalam) ✓
   - नेपाली (Nepali) ✓
   - తెలుగు (Telugu) ✓
   - ಕನ್ನಡ (Kannada) ✓

#### Language Persistence:
1. Change to any non-English language
2. Close the app or refresh the page
3. Reopen the app
4. **Expected**: App should still be in the language you selected

### Customer Service - Phone Calls ✅

#### Testing Call Functionality:
1. Open Settings
2. Scroll to "Customer Service" section
3. Look for "Contact Numbers" subsection
4. You should see 2 phone numbers:
   - +91908055820
   - +918766284642
5. Click the green "Call" button next to first number
6. **Expected**: 
   - On mobile: Phone dialer should open with number pre-filled
   - On desktop: Browser may prompt to open phone app or show protocol handler

#### Testing Both Numbers:
1. Test the "Call" button for first phone number ✓
2. Test the "Call" button for second phone number ✓
3. **Expected**: Each should open dialer with correct number

### Customer Service - Emails ✅

#### Testing Email Functionality:
1. Open Settings
2. Scroll to "Email Addresses" subsection
3. You should see 4 email addresses:
   - yunisnainawasti.2501269@srec.ac.in
   - taniya.2501251@srec.ac.in
   - sahana.2501214@srec.ac.in
   - rithekasree.2501204@srec.ac.in
4. Click the blue "Email" button next to first email
5. **Expected**: Default email client should open (Gmail, Outlook, Mail app, etc.)
6. **Expected**: "To:" field should have the email address pre-filled
7. Close email client without sending

#### Testing All Email Addresses:
1. Test each of the 4 email buttons one by one ✓
2. **Expected**: Each opens email client with correct address
3. Verify all 4 emails are clickable and functional

### Customer Service - Message Submission ✅

#### Sending a Test Message:
1. Open Settings
2. Scroll to "Send Message" section
3. Click in the large text area
4. Type a test message: "Test message - checking functionality"
5. Click the orange "Submit" button
6. **Expected**: Loading state appears briefly
7. **Expected**: Email client opens with:
   - **To**: All 4 customer service emails (comma-separated)
   - **Subject**: "EnableX Support Request"
   - **Body**: Your message with user details formatted like:
     ```
     From: [Your Name]
     Phone: [Your Phone]
     
     Message:
     [Your typed message]
     ```
8. **Expected**: Toast notification "Message sent successfully!"
9. Verify in email client that all 4 emails are in the "To:" field

#### Testing Empty Message:
1. Clear the message text area (leave it empty)
2. Click "Submit" button
3. **Expected**: Error toast: "Please enter your message"
4. **Expected**: Email client should NOT open

#### Testing Message Persistence:
1. Type a message but don't submit
2. Close Settings
3. Reopen Settings
4. **Expected**: Message should be cleared (fresh state)

### UI/UX Testing ✅

#### Layout and Spacing:
1. Open Settings
2. Scroll through all sections
3. **Verify**:
   - All sections have consistent padding (6px)
   - All cards have rounded corners (rounded-xl)
   - All sections have proper spacing between them
   - Text is readable and properly sized
   - No overlapping elements
   - Headers are properly aligned
   - Icons are properly sized and colored

#### Responsive Design:
1. If on desktop, resize browser window
2. **Expected**: Layout should adjust appropriately
3. **Expected**: Email addresses should wrap on small screens
4. **Expected**: Buttons should remain accessible

#### Visual Feedback:
1. Hover over any button
2. **Expected**: Button should scale up slightly (hover:scale-105 or 110)
3. **Expected**: Button should show darker gradient
4. Click any button
5. **Expected**: Clear visual feedback

#### Accessibility:
1. Tab through Settings using keyboard
2. **Expected**: All interactive elements should be reachable
3. **Expected**: Focus indicators should be visible
4. Test with different zoom levels (100%, 150%, 200%)
5. **Expected**: All content should remain readable

### Integration Testing ✅

#### Settings + Home Integration:
1. Change name in Settings to "TestUser"
2. Close Settings
3. **Expected**: Home screen shows "Hello, TestUser"
4. Change language to Tamil
5. Close Settings
6. **Expected**: Home screen shows greeting in Tamil
7. All main cards should have Tamil labels

#### Persistent Data:
1. Set name, phone, language, and login status
2. Completely close/refresh the app
3. Reopen the app
4. Open Settings
5. **Expected**: All your settings should be preserved:
   - Name still filled in
   - Phone still filled in
   - Login status maintained
   - Language preference maintained

### Error Handling ✅

#### Invalid Phone Number:
1. Enter an invalid phone number (e.g., "abc123")
2. Try to login
3. **Expected**: Should still accept (no validation currently)
4. Note: Can add validation if needed

#### Network Issues:
1. Disconnect from internet
2. Try to open email client or dialer
3. **Expected**: Native app protocols should still work (mailto:, tel:)
4. These don't require internet to open the clients

## Known Limitations

### Email Sending:
- **Current**: Opens email client, user must click "Send"
- **Why**: No backend server to send emails directly
- **Alternative**: Would need Supabase or email API integration

### Phone Calls:
- **Current**: Opens phone dialer with number
- **Platform**: Works best on mobile devices
- **Desktop**: May require phone app or service

### Message Delivery:
- **Current**: Pre-fills email with all contacts
- **Note**: Actual delivery depends on user's email client and internet
- **Security**: No PII is stored on external servers

## Browser Compatibility

### Recommended Browsers:
- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Safari (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)

### Protocol Support:
- `mailto:` - Supported in all modern browsers
- `tel:` - Supported in mobile browsers and desktop with phone app

## Performance Testing

### Loading:
1. Open Settings for the first time
2. **Expected**: Should load instantly (no network calls)

### Animations:
1. Open/Close Settings multiple times
2. **Expected**: Smooth slide-in/out animation (300ms)
3. **Expected**: No janky or stuttering motion

### Memory:
1. Open and close Settings 10+ times
2. **Expected**: No memory leaks
3. **Expected**: App should remain responsive

## Reporting Issues

If you find any issues during testing:

1. **Settings Won't Open**: 
   - Check browser console for errors
   - Verify button click is registered
   - Try refreshing the page

2. **Exit Button Not Working**:
   - Verify X button is visible and clickable
   - Check if onClick handler is firing
   - Try clicking directly on the X icon

3. **Email/Phone Not Opening**:
   - Verify browser supports mailto:/tel: protocols
   - Check if default apps are configured
   - Try on mobile device if on desktop

4. **Language Not Changing**:
   - Check localStorage for 'enablex_language'
   - Verify translation keys exist in LanguageContext
   - Try clearing localStorage and retrying

5. **Layout Issues**:
   - Check screen size and zoom level
   - Verify Tailwind CSS is loaded
   - Check for CSS conflicts

## Success Criteria

All tests pass when:
- ✅ Settings opens as full page with slide-in animation
- ✅ Exit button closes Settings and returns to home
- ✅ User profile saves and persists across sessions
- ✅ All 6 languages work and translate correctly
- ✅ Both phone numbers open dialer when clicked
- ✅ All 4 emails open email client when clicked
- ✅ Message submission opens email with all contacts
- ✅ Layout is clean, uniform, and accessible
- ✅ All animations are smooth
- ✅ No console errors
- ✅ Works on mobile and desktop browsers
