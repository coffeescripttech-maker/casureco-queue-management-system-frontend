# RawBT Troubleshooting Guide
## Android Tablet Print Preview Issue

---

## ❌ Problem: Browser Print Preview Opens Instead of RawBT

If you're seeing "Save as PDF" or "Select Printer" dialog instead of automatic printing, follow these steps:

---

## ✅ Solution Steps:

### **Step 1: Verify RawBT is Installed**

1. Open **Google Play Store**
2. Search for **"RawBT"**
3. Check if it says **"Installed"** or **"Open"**
4. If not installed:
   - Tap **"Install"**
   - Wait for installation to complete
   - Open the app

**App Link**: https://play.google.com/store/apps/details?id=ru.a402d.rawbtprinter

---

### **Step 2: Configure RawBT as Default Handler**

RawBT needs to be set as the default app for `rawbt://` URLs:

1. **Open RawBT app**
2. Tap **menu (≡)** → **Settings**
3. Find **"Set as default handler"** or **"Default app"**
4. Enable it
5. If you don't see this option, continue to Step 3

---

### **Step 3: Test RawBT Directly**

Before testing from the website, verify RawBT works:

1. **Open RawBT app**
2. Tap **"Select Bluetooth Device"**
3. Choose your paired printer
4. Tap **"Test Print"**
5. **Expected**: Ticket should print immediately
6. **If fails**: Check Bluetooth connection (see Bluetooth section below)

---

### **Step 4: Grant RawBT Permissions**

RawBT needs proper permissions to work:

1. Go to **Settings** → **Apps** → **RawBT**
2. Tap **Permissions**
3. Grant these permissions:
   - ✅ **Bluetooth** (Required)
   - ✅ **Nearby devices** (Android 12+)
   - ✅ **Storage** (Optional, for logs)
4. Tap **Back**

---

### **Step 5: Enable Auto-Print in RawBT**

1. **Open RawBT app**
2. Tap **menu (≡)** → **Settings**
3. Find these settings and enable them:
   - ✅ **Auto-connect**: ON
   - ✅ **Auto-print**: ON
   - ✅ **Start on boot**: ON (optional)
4. Tap **Save**

---

### **Step 6: Clear Browser Cache**

Sometimes the browser caches the print behavior:

1. Open **Chrome** on tablet
2. Tap **menu (⋮)** → **Settings**
3. Tap **Privacy and security**
4. Tap **Clear browsing data**
5. Select:
   - ✅ **Cached images and files**
   - ✅ **Cookies and site data**
6. Tap **Clear data**
7. Close and reopen Chrome

---

### **Step 7: Test from Console**

Open the kiosk page and test manually:

1. Open kiosk URL in Chrome
2. Tap **menu (⋮)** → **More tools** → **Developer tools**
3. Go to **Console** tab
4. Type this command and press Enter:
   ```javascript
   window.location.href = 'rawbt:base64,SGVsbG8gV29ybGQh'
   ```
5. **Expected**: RawBT should open and print "Hello World!"
6. **If browser print dialog opens**: RawBT is not set as default handler

---

### **Step 8: Alternative - Use Intent URL**

If `rawbt://` doesn't work, try the intent URL format:

**For developers**: Update the code to use Android Intent:

```typescript
// Instead of:
window.location.href = `rawbt:base64,${base64Text}`;

// Try:
const intentUrl = `intent://base64,${base64Text}#Intent;scheme=rawbt;package=ru.a402d.rawbtprinter;end`;
window.location.href = intentUrl;
```

---

## 🔧 Common Issues & Fixes:

### **Issue 1: "No app can perform this action"**

**Cause**: RawBT is not installed or not set as default handler

**Fix**:
1. Install RawBT from Play Store
2. Open RawBT app at least once
3. Try printing again

---

### **Issue 2: RawBT opens but doesn't print**

**Cause**: Bluetooth printer not connected

**Fix**:
1. Open **Settings** → **Bluetooth**
2. Check printer is **Connected** (not just Paired)
3. If not connected:
   - Tap printer name
   - Wait for "Connected" status
4. Open RawBT app
5. Select printer again
6. Test print

---

### **Issue 3: Prints to wrong printer**

**Cause**: Multiple Bluetooth printers paired

**Fix**:
1. Open **RawBT app**
2. Tap **"Select Bluetooth Device"**
3. Choose the correct printer (e.g., GP-1424D)
4. Tap **"Set as default"** if available
5. Test print

---

### **Issue 4: Print preview still appears**

**Cause**: Browser is handling the print instead of RawBT

**Fix Option 1 - Use RawBT Share Intent**:
1. Open RawBT app
2. Go to Settings
3. Enable **"Intercept print requests"** if available

**Fix Option 2 - Disable Browser Print**:
1. In Chrome, go to **Settings**
2. Search for **"Print"**
3. Disable **"Print preview"** if available

**Fix Option 3 - Use Kiosk Browser**:
1. Install **"Fully Kiosk Browser"** from Play Store
2. Configure it to use RawBT for printing
3. Use Fully Kiosk instead of Chrome

---

## 📱 Bluetooth Connection Issues:

### **Printer won't connect:**

1. **Turn printer OFF and ON**
2. **Forget device** in Bluetooth settings
3. **Re-pair printer**:
   - Settings → Bluetooth
   - Scan for devices
   - Tap printer name
   - Enter PIN (usually 0000 or 1234)
4. **Test connection**:
   - Open RawBT
   - Select printer
   - Test print

---

### **Printer connects but disconnects:**

**Causes**:
- Low battery (if wireless printer)
- Out of range
- Bluetooth interference

**Fixes**:
1. **Charge printer** or replace batteries
2. **Move tablet closer** to printer (within 10 meters)
3. **Reduce interference**:
   - Turn off other Bluetooth devices
   - Move away from WiFi routers
   - Avoid metal obstacles

---

## 🔍 Debugging Steps:

### **Check if Android is detected:**

1. Open kiosk page
2. Create a ticket
3. Open **Developer Console** (Chrome menu → More tools → Developer tools)
4. Look for these messages:
   ```
   📱 Auto-printing via RawBT (Android)...
   📱 Printing via RawBT...
   📱 Ticket text: [ticket content]
   📱 RawBT URL: rawbt:base64,[encoded text]
   ```

**If you see these**: Android is detected correctly ✅

**If you see**:
```
🖨️ Auto-opening print dialog (Browser)...
```
**Problem**: System thinks you're on laptop, not Android

**Fix**: Check User Agent
1. Open Chrome on tablet
2. Go to: `chrome://version`
3. Look for **User-Agent** line
4. Should contain word **"Android"**
5. If not, your browser might be in Desktop mode

---

### **Disable Desktop Mode:**

1. In Chrome, tap **menu (⋮)**
2. Look for **"Desktop site"** checkbox
3. If checked, **uncheck it**
4. Refresh the page
5. Try printing again

---

## 🎯 Quick Checklist:

Before asking for help, verify:

- [ ] RawBT app is installed
- [ ] RawBT app has been opened at least once
- [ ] Bluetooth printer is paired AND connected
- [ ] RawBT test print works
- [ ] RawBT auto-print is enabled
- [ ] RawBT auto-connect is enabled
- [ ] Browser cache is cleared
- [ ] Chrome is NOT in desktop mode
- [ ] Developer console shows "Android detected"

---

## 🆘 Still Not Working?

### **Try Manual Print Button:**

Instead of auto-print, use the manual button:

1. Create ticket
2. Wait for ticket screen
3. Tap **"Print Ticket"** button
4. Should trigger RawBT

**If this works**: Auto-print timing issue
**If this doesn't work**: RawBT setup issue

---

### **Alternative: Use Different Browser**

Try these browsers that work better with custom URL schemes:

1. **Fully Kiosk Browser** (Recommended)
   - Best for kiosk mode
   - Better custom URL handling
   - Built-in kiosk features

2. **Firefox for Android**
   - Better custom URL support
   - May work better with RawBT

3. **Samsung Internet** (if on Samsung tablet)
   - Good custom URL handling

---

## 📞 Get Help:

If none of these solutions work:

1. **Check RawBT app reviews** on Play Store
   - See if others have similar issues
   - Check developer responses

2. **Contact RawBT support**:
   - Email: (check app for contact info)
   - Play Store: Leave a question in reviews

3. **Contact us**:
   - Email: support@casureco.com
   - Include:
     - Android version
     - Tablet model
     - RawBT version
     - Printer model
     - Screenshots of error

---

## 💡 Workaround: Manual Print Mode

If RawBT won't work automatically, you can still use manual printing:

### **Option 1: Manual RawBT**
1. Disable auto-print in code
2. User taps "Print Ticket" button
3. RawBT opens
4. User confirms print

### **Option 2: Browser Print to Bluetooth**
1. Some Android browsers can print directly to Bluetooth
2. Settings → Printing → Add Bluetooth printer
3. Use browser print dialog
4. Select Bluetooth printer

### **Option 3: Use Laptop Kiosk**
- Your laptop setup works perfectly
- Use laptop for kiosk instead of tablet
- Tablet can be used for other purposes

---

## ✅ Success Indicators:

You'll know it's working when:

1. ✅ Create ticket on tablet
2. ✅ RawBT app opens briefly (1-2 seconds)
3. ✅ Ticket prints automatically
4. ✅ Returns to kiosk page
5. ✅ No print dialog appears

---

**Last Updated**: December 4, 2025  
**Version**: 1.0  
**For**: CASURECO II Queue Management System - RawBT Troubleshooting
