# Android Tablet Setup Guide
## RawBT Thermal Printer Integration

---

## 📱 Overview

This guide explains how to set up your Android tablet as a kiosk terminal with automatic thermal printing using **RawBT** app.

---

## 🎯 What You Need

### Hardware:
- ✅ Android tablet (Android 5.0 or higher)
- ✅ Bluetooth thermal printer (e.g., Gprinter GP-1424D with Bluetooth)
- ✅ Stable internet connection (WiFi)

### Software:
- ✅ Chrome browser (or any modern browser)
- ✅ RawBT app (from Google Play Store)

---

## 📥 Step 1: Install RawBT App

### Download RawBT:
1. Open **Google Play Store** on your Android tablet
2. Search for **"RawBT"** or **"RawBT ESC POS Printer"**
3. Install the app by **Redo Visión Artificial**
4. Open the app after installation

### Alternative:
- Direct link: https://play.google.com/store/apps/details?id=ru.a402d.rawbtprinter

---

## 🔗 Step 2: Connect Bluetooth Printer

### Pair Printer:
1. **Turn on your thermal printer**
2. On tablet, go to **Settings → Bluetooth**
3. Enable Bluetooth
4. Find your printer in available devices (e.g., "GP-1424D")
5. Tap to pair (PIN usually: 0000 or 1234)
6. Wait for "Connected" status

### Configure RawBT:
1. Open **RawBT app**
2. Tap **"Select Bluetooth Device"**
3. Choose your paired printer from the list
4. Tap **"Test Print"** to verify connection
5. If successful, you'll see a test receipt print

---

## ⚙️ Step 3: Configure RawBT Settings

### Recommended Settings:

1. **Open RawBT app**
2. Tap **menu (≡)** → **Settings**

3. **Configure these options:**
   - ✅ **Auto-connect**: ON (automatically connects to printer)
   - ✅ **Auto-print**: ON (prints immediately when data received)
   - ✅ **Encoding**: UTF-8
   - ✅ **Paper width**: 58mm or 80mm (match your printer)
   - ✅ **Font size**: Medium
   - ✅ **Line spacing**: Normal

4. **Save settings**

---

## 🌐 Step 4: Access Kiosk Website

### Open in Browser:
1. Open **Chrome** on your Android tablet
2. Navigate to your kiosk URL:
   ```
   http://your-server-ip:3000/kiosk
   ```
   Or if deployed:
   ```
   https://your-domain.com/kiosk
   ```

3. The system will **automatically detect** it's running on Android

---

## 🎫 Step 5: Test Printing

### Create Test Ticket:
1. On the kiosk page, select a service
2. Select priority level
3. Tap **"Get Ticket"**
4. The system will:
   - ✅ Detect Android device
   - ✅ Generate plain text ticket
   - ✅ Send to RawBT automatically
   - ✅ RawBT prints to thermal printer

### Expected Behavior:
```
1. Ticket created ✅
2. RawBT app opens briefly
3. Ticket prints automatically ✅
4. Returns to kiosk page
```

---

## 📄 Ticket Format (Android/RawBT)

### Plain Text Format:
```
        CASURECO II
      December 4, 2025
--------------------------------

    YOUR TICKET NUMBER

           C-001

--------------------------------

Service: Cashier
Queue Position: 5
Estimated Wait: 15 minutes
Time Issued: 10:30 AM

--------------------------------

   Thank you for your patience
     We're here to serve you



```

**Note**: Android tablets print plain text format (no colors/logos) due to thermal printer limitations. Laptop/desktop browsers print the full styled version.

---

## 🔧 Troubleshooting

### Problem: RawBT doesn't open

**Solution:**
1. Check RawBT is installed
2. Grant RawBT all permissions:
   - Settings → Apps → RawBT → Permissions
   - Enable all requested permissions
3. Set RawBT as default handler for `rawbt://` URLs

---

### Problem: Printer not connecting

**Solution:**
1. **Check Bluetooth:**
   - Settings → Bluetooth → Verify printer is paired
   - If not paired, pair again

2. **Check printer power:**
   - Ensure printer is ON
   - Check battery level (if wireless)

3. **Re-pair printer:**
   - Settings → Bluetooth → Forget device
   - Pair again from scratch

4. **Test in RawBT app:**
   - Open RawBT
   - Select printer
   - Tap "Test Print"
   - If this fails, issue is with printer/Bluetooth

---

### Problem: Ticket prints but is blank

**Solution:**
1. **Check printer paper:**
   - Ensure thermal paper is loaded correctly
   - Thermal side should face print head

2. **Check RawBT encoding:**
   - RawBT → Settings → Encoding → UTF-8

3. **Test with simple text:**
   - Open RawBT
   - Tap "Test Print"
   - If test works but tickets don't, contact support

---

### Problem: Ticket prints garbled text

**Solution:**
1. **Change encoding:**
   - RawBT → Settings → Encoding
   - Try: UTF-8, ASCII, or ISO-8859-1

2. **Check printer compatibility:**
   - Ensure printer supports ESC/POS commands
   - Check printer manual

---

### Problem: Auto-print doesn't work

**Solution:**
1. **Enable auto-print in RawBT:**
   - RawBT → Settings → Auto-print → ON

2. **Check browser permissions:**
   - Chrome → Settings → Site settings
   - Allow pop-ups for your kiosk URL

3. **Manual print option:**
   - If auto-print fails, tap "Print Ticket" button

---

### Problem: Prints multiple copies

**Solution:**
1. **Disable auto-print in RawBT temporarily:**
   - RawBT → Settings → Auto-print → OFF
   - Use manual print button instead

2. **Check for multiple RawBT instances:**
   - Close all RawBT windows
   - Restart tablet

---

## 🎨 Comparison: Android vs Laptop Printing

| Feature | Android Tablet (RawBT) | Laptop (Browser) |
|---------|------------------------|------------------|
| **Print Method** | RawBT app → Bluetooth | Chrome kiosk mode |
| **Ticket Format** | Plain text | Styled HTML |
| **Logo** | No (text only) | Yes (full color) |
| **Colors** | No | Yes |
| **Borders** | Text-based | CSS styled |
| **Speed** | Instant | ~100ms |
| **Auto-print** | Yes | Yes |
| **Printer Type** | Bluetooth thermal | USB/Network thermal |

---

## 🚀 Full Kiosk Mode (Optional)

### Make Tablet Full-Screen Kiosk:

#### Option 1: Chrome Kiosk Mode
1. Install **"Fully Kiosk Browser"** from Play Store
2. Configure:
   - Start URL: Your kiosk URL
   - Kiosk mode: Enabled
   - Hide navigation: Yes
   - Auto-start on boot: Yes

#### Option 2: Native Chrome
1. Open Chrome
2. Navigate to kiosk URL
3. Tap menu (⋮) → **"Add to Home screen"**
4. Name it "Queue Kiosk"
5. Open from home screen (runs full-screen)

#### Option 3: Android Kiosk Apps
- **Kiosk Browser Lockdown** (Play Store)
- **SureLock** (Play Store)
- **Fully Kiosk Browser** (Play Store) - Recommended!

---

## 🔒 Security Settings (Production)

### Lock Down Tablet:
1. **Disable unnecessary apps:**
   - Settings → Apps → Disable unused apps

2. **Set up kiosk mode:**
   - Use kiosk app (Fully Kiosk Browser)
   - Prevent access to settings
   - Disable home button

3. **Auto-start on boot:**
   - Configure kiosk app to launch on startup
   - Tablet boots directly to queue kiosk

4. **Network security:**
   - Connect to secure WiFi
   - Use VPN if accessing over internet

---

## 📊 Performance Tips

### Optimize Tablet Performance:
1. **Close background apps:**
   - Settings → Apps → Force stop unused apps

2. **Clear browser cache regularly:**
   - Chrome → Settings → Privacy → Clear browsing data

3. **Keep tablet charged:**
   - Keep plugged in during operation
   - Or use high-capacity power bank

4. **Stable internet:**
   - Use WiFi (not mobile data)
   - Position near WiFi router for strong signal

---

## 🔄 Daily Operations

### Start of Day:
1. Turn on thermal printer
2. Turn on tablet
3. Verify Bluetooth connection (should auto-connect)
4. Open kiosk URL in browser
5. Test print one ticket

### During Day:
- Monitor printer paper level
- Check Bluetooth connection if prints fail
- Restart RawBT app if issues occur

### End of Day:
- Close browser
- Turn off printer
- Charge tablet overnight

---

## 📞 Support

### Common Issues:
- **Printer not connecting**: Re-pair Bluetooth
- **Blank prints**: Check paper orientation
- **Garbled text**: Change RawBT encoding
- **No auto-print**: Enable in RawBT settings

### Contact:
- **Technical Support**: support@casureco.com
- **RawBT Help**: Check app settings → Help

---

## ✅ Quick Setup Checklist

- [ ] Android tablet ready
- [ ] Bluetooth thermal printer
- [ ] RawBT app installed
- [ ] Printer paired via Bluetooth
- [ ] RawBT configured (auto-connect, auto-print)
- [ ] Test print successful
- [ ] Kiosk URL accessible
- [ ] Test ticket printed successfully
- [ ] Full-screen kiosk mode set up (optional)

---

## 🎯 Summary

**Your Android tablet is now a fully functional kiosk terminal!**

- ✅ Automatic ticket printing via RawBT
- ✅ Bluetooth thermal printer support
- ✅ No manual intervention needed
- ✅ Works alongside laptop kiosks
- ✅ Same queue system, different devices

**The system automatically detects Android and uses RawBT. Your laptop continues to use browser printing. Both work perfectly!**

---

**Last Updated**: December 4, 2025  
**Version**: 1.0  
**For**: CASURECO II Queue Management System - Android Tablet Support
