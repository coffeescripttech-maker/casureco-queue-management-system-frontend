# 🔧 QUEUE MANAGEMENT SYSTEM
## Easy Technical Setup Guide for Clients

---

**For:** CASURECO II  
**Date:** December 8, 2025  
**Purpose:** Simple, visual guide to understand your new system

---

## 📋 TABLE OF CONTENTS

1. [System Overview](#system-overview)
2. [Equipment List](#equipment-list)
3. [Physical Layout](#physical-layout)
4. [How Everything Connects](#how-everything-connects)
5. [Step-by-Step Setup](#step-by-step-setup)
6. [Daily Operations](#daily-operations)
7. [Troubleshooting](#troubleshooting)
8. [Maintenance](#maintenance)

---

## 🎯 SYSTEM OVERVIEW

### What is this system?

Your Queue Management System is like a **digital traffic controller** for your customers. Instead of people standing in line, they:

1. Get a ticket from a **tablet kiosk**
2. See their number on a **TV display**
3. Wait comfortably until called
4. Go to the assigned counter

**Result:** Organized, fair, and efficient customer service!

---

## 📦 EQUIPMENT LIST

### What's in the box?

#### 1️⃣ **TABLET KIOSK** (Customer Station)
```
┌─────────────────┐
│                 │
│   [  TABLET  ]  │  ← 10" touchscreen
│                 │
│  Touch to get   │
│  your ticket!   │
│                 │
└────────┬────────┘
         │
    [PRINTER]  ← Prints tickets
```
**What it does:**
- Customers touch the screen
- Select their service
- Get a printed ticket
- Shows queue position

---

#### 2️⃣ **SERVER LAPTOP** (Staff Station)
```
┌──────────────────────┐
│  ╔════════════════╗  │
│  ║   LAPTOP       ║  │
│  ║   SCREEN       ║  │
│  ╚════════════════╝  │
│  [    KEYBOARD    ]  │
└──────────────────────┘
```
**What it does:**
- Staff calls next customer
- Manages the queue
- Shows customer info
- Connects to TV display

---

#### 3️⃣ **DISPLAY TV** (Public Board)
```
┌─────────────────────────────┐
│                             │
│   NOW SERVING               │
│                             │
│   🎫 C-042                  │
│   Counter 1                 │
│                             │
│   🎫 NB-015                 │
│   Counter 2                 │
│                             │
└─────────────────────────────┘
```
**What it does:**
- Shows current tickets
- Displays counter numbers
- Updates in real-time
- Shows announcements

---

#### 4️⃣ **THERMAL PRINTERS** (2 units)
```
┌──────────────┐
│ ╔══════════╗ │
│ ║ PRINTER  ║ │
│ ╚══════════╝ │
│              │
│ [Paper Out]  │ ← Ticket comes out here
└──────────────┘
```
**What it does:**
- Prints tickets instantly
- No ink needed (thermal)
- Fast and quiet
- Professional tickets

---

#### 5️⃣ **SPEAKERS** (Audio System)
```
┌─────────┐  ┌─────────┐
│ ♪♪♪♪♪♪♪ │  │ ♪♪♪♪♪♪♪ │
│ SPEAKER │  │ SPEAKER │
│         │  │         │
└─────────┘  └─────────┘
```
**What it does:**
- Announces ticket numbers
- Plays alert sounds
- Connected to laptop

---

#### 6️⃣ **NETWORK ROUTER** (WiFi Hub)
```
┌──────────────┐
│   )))  )))   │ ← WiFi signals
│   ROUTER     │
│ [●][●][●][●] │ ← Network ports
└──────────────┘
```
**What it does:**
- Connects all devices
- Provides WiFi
- Internet connection
- Secure network

---

#### 7️⃣ **UPS** (Backup Power)
```
┌──────────────────┐
│   UPS - BACKUP   │
│                  │
│  [●][●][●][●]    │ ← Power outlets
│                  │
│  Battery: ████   │ ← Backup battery
└──────────────────┘
```
**What it does:**
- Protects from power cuts
- 15-30 minute backup
- Prevents data loss
- Surge protection

---

## 🏗️ PHYSICAL LAYOUT

### Where everything goes:

```
                    ENTRANCE
                        │
                        ▼
        ┌───────────────────────────┐
        │                           │
        │    CUSTOMER WAITING       │
        │         AREA              │
        │                           │
        │   [Chairs] [Chairs]       │
        │   [Chairs] [Chairs]       │
        │                           │
        └───────────────────────────┘
                        │
                        ▼
        ┌───────────────────────────┐
        │                           │
        │   📺 [32" TV DISPLAY]     │ ← Wall-mounted
        │      (Shows tickets)      │
        │                           │
        │   🔊 [SPEAKERS]           │ ← Near TV
        │                           │
        └───────────────────────────┘
                        │
                        ▼
        ┌───────────────────────────┐
        │                           │
        │   📱 [TABLET KIOSK]       │ ← On stand
        │      + Printer            │
        │                           │
        │   "Get Your Ticket Here"  │
        │                           │
        └───────────────────────────┘
                        │
                        ▼
        ┌───────────────────────────┐
        │                           │
        │   STAFF COUNTER           │
        │                           │
        │   💻 [LAPTOP]             │ ← Staff workstation
        │      + Printer            │
        │                           │
        │   Staff sits here →  [👤] │
        │                           │
        └───────────────────────────┘
                        │
                        ▼
        ┌───────────────────────────┐
        │   BACK OFFICE             │
        │                           │
        │   📡 [Router]             │ ← Hidden/secure
        │   🔋 [UPS]                │
        │                           │
        └───────────────────────────┘
```

---

## 🔌 HOW EVERYTHING CONNECTS

### Connection Diagram:

```
                    ☁️ INTERNET CLOUD
                         │
                         │ (WiFi/Cable)
                         │
                    ┌────▼────┐
                    │ ROUTER  │ ← Main hub
                    └────┬────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         │               │               │
    ┌────▼────┐    ┌────▼────┐    ┌────▼────┐
    │ TABLET  │    │ LAPTOP  │    │   TV    │
    │ KIOSK   │    │ SERVER  │    │ DISPLAY │
    └────┬────┘    └────┬────┘    └─────────┘
         │               │
         │               │
    ┌────▼────┐    ┌────▼────┐
    │PRINTER 1│    │PRINTER 2│
    └─────────┘    └─────────┘
         
         All powered by:
              ┌────┐
              │UPS │ ← Backup power
              └────┘
```

### What connects to what:

| Device | Connects To | How |
|--------|-------------|-----|
| **Tablet** | Router | WiFi |
| **Tablet** | Printer 1 | USB cable |
| **Laptop** | Router | WiFi or Ethernet |
| **Laptop** | Printer 2 | USB cable |
| **Laptop** | TV | HDMI cable |
| **Laptop** | Speakers | Audio cable (3.5mm) |
| **Router** | Internet | Ethernet cable |
| **All devices** | UPS | Power cables |

---

## 🚀 STEP-BY-STEP SETUP

### Phase 1: Physical Installation (Day 1)

#### Morning Session:

**Step 1: Mount the TV** ⏱️ 1 hour
```
1. Find good wall location (visible to waiting area)
2. Mark drill holes using wall mount template
3. Drill holes and insert wall anchors
4. Attach wall mount bracket
5. Hang TV on bracket
6. Secure with safety screws
7. Test tilt/swivel movement

✅ TV should be 5-6 feet high, facing waiting area
```

**Step 2: Set Up Kiosk** ⏱️ 30 minutes
```
1. Place tablet stand in accessible location
2. Secure stand to counter/table (if needed)
3. Mount tablet on stand
4. Adjust angle for easy touch access
5. Place printer next to stand
6. Connect printer to tablet (USB)

✅ Kiosk should be at comfortable height for standing customers
```

**Step 3: Set Up Staff Counter** ⏱️ 30 minutes
```
1. Place laptop on staff counter
2. Position printer within reach
3. Connect printer to laptop (USB)
4. Arrange cables neatly
5. Ensure staff has comfortable workspace

✅ Staff should see laptop screen and customers easily
```

#### Afternoon Session:

**Step 4: Install Network** ⏱️ 1 hour
```
1. Place router in central, secure location
2. Connect router to internet modem
3. Power on router
4. Wait for lights to stabilize (2-3 minutes)
5. Note WiFi name and password (on router sticker)

✅ Router should have stable internet connection
```

**Step 5: Connect Devices to Network** ⏱️ 1 hour
```
TABLET:
1. Turn on tablet
2. Go to Settings → WiFi
3. Select your network
4. Enter password
5. Test internet (open browser)

LAPTOP:
1. Turn on laptop
2. Click WiFi icon
3. Select your network
4. Enter password
5. Test internet (open browser)

✅ Both devices should show "Connected"
```

**Step 6: Connect TV and Audio** ⏱️ 30 minutes
```
1. Connect HDMI cable: Laptop → TV
2. Turn on TV
3. Select HDMI input on TV
4. Laptop screen should appear on TV
5. Connect speakers to laptop (audio jack)
6. Test audio (play sound)

✅ TV should mirror laptop screen, audio should work
```

**Step 7: Set Up Power Protection** ⏱️ 30 minutes
```
1. Place UPS near power outlet
2. Plug UPS into wall outlet
3. Plug these into UPS:
   - Laptop charger
   - Router
   - Printer 1
   - Printer 2
4. Plug tablet charger into regular outlet
5. Test UPS (unplug from wall, devices should stay on)

✅ UPS should show "On Battery" when unplugged
```

**Step 8: Cable Management** ⏱️ 1 hour
```
1. Bundle cables together with cable ties
2. Route cables along walls/furniture
3. Use cable clips to secure
4. Hide cables where possible
5. Label important cables
6. Ensure no tripping hazards

✅ Setup should look clean and professional
```

---

### Phase 2: Software Setup (Day 2)

#### Morning Session:

**Step 1: Install Printer Drivers** ⏱️ 30 minutes
```
TABLET:
1. Printer should auto-detect (Android)
2. If not, download Gprinter app from Play Store
3. Open app and follow setup wizard
4. Test print

LAPTOP:
1. Insert printer driver CD (or download from website)
2. Run installer
3. Follow on-screen instructions
4. Select USB connection
5. Test print

✅ Both printers should print test page successfully
```

**Step 2: Access the System** ⏱️ 15 minutes
```
LAPTOP:
1. Open Chrome browser
2. Go to: [your-system-url].com
3. Bookmark this page
4. You should see login screen

TABLET:
1. Open Chrome browser
2. Go to: [your-system-url].com/kiosk
3. Bookmark this page
4. You should see kiosk interface

✅ Both devices should load the system
```

**Step 3: Initial Configuration** ⏱️ 1 hour
```
We (the installers) will:
1. Log in as admin
2. Upload your company logo
3. Set your brand colors
4. Create your services (Cashier, New Business, etc.)
5. Set up counters
6. Create user accounts

✅ System should show your branding
```

#### Afternoon Session:

**Step 4: Configure Kiosk Mode** ⏱️ 30 minutes
```
TABLET:
1. Open Chrome
2. Go to kiosk page
3. Tap menu (3 dots)
4. Select "Add to Home Screen"
5. Name it "Queue Kiosk"
6. Tap the new icon to open
7. It will open in full-screen mode

✅ Kiosk should fill entire screen, no browser bars
```

**Step 5: Configure Display Board** ⏱️ 30 minutes
```
LAPTOP:
1. Open Chrome
2. Go to: [your-system-url].com/display
3. Press F11 for full-screen
4. TV should show display board
5. Adjust TV settings (brightness, contrast)

✅ Display should be clear and readable from waiting area
```

**Step 6: Set Up Auto-Print** ⏱️ 30 minutes
```
TABLET:
1. We'll configure Chrome to auto-print
2. Test by creating a ticket
3. Ticket should print automatically
4. Adjust printer settings if needed

✅ Tickets should print within 1-2 seconds
```

**Step 7: System Testing** ⏱️ 2 hours
```
We'll test:
1. ✅ Create ticket on kiosk → prints correctly
2. ✅ Ticket appears in staff dashboard
3. ✅ Call next customer → shows on TV
4. ✅ Complete service → updates queue
5. ✅ Audio announcement works
6. ✅ All features working
7. ✅ Fix any issues found

✅ Everything should work smoothly
```

---

### Phase 3: Training (Days 3-4)

**Day 3: Basic Training** ⏱️ 8 hours
- System overview presentation
- How to use kiosk (customer perspective)
- Staff dashboard training
- Supervisor features
- Admin panel basics

**Day 4: Advanced Training** ⏱️ 8 hours
- Hands-on practice
- Common scenarios
- Troubleshooting
- Reports and analytics
- Q&A session

---

## 📱 DAILY OPERATIONS

### Morning Startup (5 minutes)

**Step 1: Power On** ⏱️ 2 minutes
```
1. Check UPS is plugged in (green light)
2. Turn on laptop
3. Turn on TV
4. Wake up tablet (should already be on)
5. Check router lights (should be blinking)
```

**Step 2: Open System** ⏱️ 2 minutes
```
LAPTOP:
1. Log in to Windows
2. Open Chrome
3. Go to bookmarked system page
4. Log in with your credentials
5. Open display board on TV (F11 for full-screen)

TABLET:
1. Wake up screen
2. Tap "Queue Kiosk" icon
3. Should show service selection screen
```

**Step 3: Quick Check** ⏱️ 1 minute
```
✅ Kiosk showing service options
✅ Display board showing "No tickets yet"
✅ Staff dashboard loaded
✅ Printers have paper
✅ Audio working (test volume)
```

**You're ready to serve customers!** 🎉

---

### During the Day

#### For Staff:

**When customer arrives:**
1. Customer uses kiosk (no staff needed)
2. Ticket prints automatically
3. Customer waits

**When ready to serve:**
1. Click "Call Next" button
2. Ticket number shows on TV
3. Audio announces number
4. Customer comes to counter
5. Serve customer
6. Click "Complete" when done
7. Repeat!

**That's it!** 👍

---

### Evening Shutdown (3 minutes)

**Step 1: Close Applications** ⏱️ 1 minute
```
LAPTOP:
1. Close Chrome browser
2. Leave laptop on (or shut down if preferred)

TABLET:
1. Press home button
2. Leave tablet on (it will sleep automatically)
```

**Step 2: Check Printers** ⏱️ 1 minute
```
1. Check paper levels
2. Refill if low (keep spare rolls nearby)
3. Turn off printers (optional)
```

**Step 3: Power Down** ⏱️ 1 minute
```
1. Turn off TV
2. Leave router on (24/7)
3. Leave UPS on (24/7)
4. Lock up and go home!
```

---

## 🔧 TROUBLESHOOTING

### Common Issues and Quick Fixes

#### ❌ Problem: Tablet not printing

**Solution:**
```
1. Check printer power (is it on?)
2. Check USB cable connection
3. Check paper (is there paper?)
4. Restart printer (turn off/on)
5. Restart tablet if needed
6. Test print from printer settings
```

---

#### ❌ Problem: TV not showing display

**Solution:**
```
1. Check TV power (is it on?)
2. Check HDMI cable connection
3. Check TV input (should be HDMI)
4. Press Windows + P on laptop
5. Select "Duplicate" or "Extend"
6. Refresh browser (F5)
```

---

#### ❌ Problem: No internet connection

**Solution:**
```
1. Check router lights (should be blinking)
2. Check router power cable
3. Check internet modem (separate device)
4. Restart router (unplug 30 seconds, plug back)
5. Wait 2-3 minutes for reconnection
6. Check WiFi on devices
```

---

#### ❌ Problem: Kiosk frozen/not responding

**Solution:**
```
1. Press home button on tablet
2. Close Chrome app
3. Reopen "Queue Kiosk" icon
4. If still frozen, restart tablet:
   - Hold power button 10 seconds
   - Wait for shutdown
   - Turn back on
   - Reopen kiosk
```

---

#### ❌ Problem: Audio not working

**Solution:**
```
1. Check speaker power (is it on?)
2. Check audio cable connection
3. Check laptop volume (not muted?)
4. Check speaker volume knob
5. Test with YouTube video
6. Adjust volume as needed
```

---

#### ❌ Problem: Printer paper jam

**Solution:**
```
1. Turn off printer
2. Open printer cover
3. Gently remove jammed paper
4. Check for torn pieces
5. Close cover
6. Turn on printer
7. Test print
```

---

#### ❌ Problem: Can't log in

**Solution:**
```
1. Check username spelling
2. Check password (case-sensitive)
3. Check Caps Lock key
4. Try "Forgot Password" link
5. Contact admin for password reset
6. Check internet connection
```

---

### 🆘 When to Call Support

Call us immediately if:
- ❌ System completely down
- ❌ Data loss or corruption
- ❌ Security issues
- ❌ Hardware failure
- ❌ Can't fix after trying troubleshooting

**Support Contact:**
- 📞 Phone: [Your Phone]
- 📧 Email: support@yourcompany.com
- ⏰ Hours: Mon-Fri, 8 AM - 5 PM

---

## 🧹 MAINTENANCE

### Daily Maintenance (5 minutes)

**Every Day:**
```
✅ Check printer paper levels
✅ Clean tablet screen (microfiber cloth)
✅ Check all cables connected
✅ Verify internet connection
✅ Test one ticket print
```

---

### Weekly Maintenance (15 minutes)

**Every Week:**
```
✅ Clean all screens (laptop, tablet, TV)
✅ Check printer for dust
✅ Organize cables
✅ Check UPS battery indicator
✅ Test backup power (unplug UPS briefly)
✅ Review system reports
```

---

### Monthly Maintenance (30 minutes)

**Every Month:**
```
✅ Deep clean all equipment
✅ Check for software updates
✅ Review printer paper inventory
✅ Test all features thoroughly
✅ Backup system data
✅ Review user accounts
✅ Check cable wear and tear
```

---

### Supplies to Keep on Hand

**Always have:**
- 📄 Thermal paper rolls (at least 10 rolls)
- 🧹 Microfiber cleaning cloths
- 🔌 Spare USB cables
- 🔌 Spare HDMI cable
- 🔌 Spare power cables
- 📝 User manual (this document)
- 📞 Support contact info

---

## 📊 SYSTEM SPECIFICATIONS SUMMARY

### Tablet Kiosk
- **Screen:** 10-inch touchscreen
- **OS:** Android
- **Storage:** 64GB
- **RAM:** 4GB
- **WiFi:** Yes
- **Battery:** 6000mAh (always plugged in)

### Server Laptop
- **Processor:** Intel Core i5
- **RAM:** 8GB
- **Storage:** 256GB SSD
- **OS:** Windows 11 Pro
- **Ports:** USB, HDMI, Ethernet
- **WiFi:** Yes

### Thermal Printers (2x)
- **Model:** Gprinter GP-1424D
- **Paper:** 58mm thermal
- **Speed:** 90mm/second
- **Connection:** USB
- **Auto-cutter:** Yes

### Display TV
- **Size:** 32 inches
- **Resolution:** 1920x1080 (Full HD)
- **Input:** HDMI
- **Mount:** Wall-mounted

### Network Router
- **WiFi:** Dual-band (2.4GHz + 5GHz)
- **Ethernet:** 4 ports
- **Security:** WPA3
- **Speed:** Up to 1200 Mbps

### UPS
- **Capacity:** 1000VA / 600W
- **Backup:** 15-30 minutes
- **Outlets:** 4 battery backup
- **Features:** AVR, surge protection

---

## ✅ SETUP CHECKLIST

### Before Installation:
- [ ] Internet connection available
- [ ] Power outlets available (at least 6)
- [ ] Wall space for TV mount
- [ ] Counter space for kiosk
- [ ] Desk space for laptop
- [ ] Waiting area set up

### After Installation:
- [ ] All hardware installed
- [ ] All devices connected
- [ ] Internet working
- [ ] Printers printing
- [ ] TV displaying correctly
- [ ] Audio working
- [ ] Kiosk operational
- [ ] Staff dashboard working
- [ ] All users trained
- [ ] Documentation provided

---

## 🎓 QUICK REFERENCE

### Important URLs:
- **Staff Dashboard:** [your-url].com
- **Kiosk:** [your-url].com/kiosk
- **Display Board:** [your-url].com/display
- **Admin Panel:** [your-url].com/admin

### Default Accounts:
- **Admin:** admin@casureco.com
- **Supervisor:** supervisor@casureco.com
- **Staff:** staff@casureco.com
- (Passwords provided separately)

### Support:
- **Phone:** [Your Phone]
- **Email:** support@yourcompany.com
- **Hours:** Mon-Fri, 8 AM - 5 PM

---

## 📞 EMERGENCY CONTACTS

### Technical Support:
**Primary:** [Your Name] - [Your Phone]  
**Secondary:** [Backup Name] - [Backup Phone]  
**Email:** support@yourcompany.com

### Hardware Issues:
**Laptop:** [Laptop Supplier] - [Phone]  
**Printers:** [Printer Supplier] - [Phone]  
**Network:** [ISP Name] - [Phone]

---

## 🎉 CONGRATULATIONS!

Your Queue Management System is now set up and ready to use!

**Remember:**
- ✅ Keep this guide handy
- ✅ Train all staff members
- ✅ Perform regular maintenance
- ✅ Call support when needed
- ✅ Enjoy better customer service!

---

**Document Version:** 1.0  
**Last Updated:** December 8, 2025  
**Prepared By:** [Your Company Name]

**Questions? We're here to help!**  
📞 [Your Phone] | 📧 support@yourcompany.com
