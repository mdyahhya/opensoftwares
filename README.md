# OpenSoftwares — Official Website

> **Domain:** [opensoftwares.in](https://opensoftwares.in)  
> **Flagship Product:** Schoolmate by OpenSoftwares (Android App + Web ERP)

A production-ready, multi-page static website built with pure semantic **HTML5**, **CSS3**, and **vanilla JavaScript**. Engineered with zero external dependencies, no frameworks, and no build tools. Ready for zero-configuration instant deployment on **Vercel**.

---

## Overview

OpenSoftwares is a group of companies managing software in the education, manufacturing, and real estate industries. This website showcases our primary live flagship product:

- **Schoolmate by OpenSoftwares**:
  - **Native Android App**: Real-time push alerts, attendance tracking, educational videos, homework, one-tap UPI fee receipts, and direct parent-teacher communication.
  - **Web ERP for Administration**: Biometric staff attendance, payroll with Maharashtra PT/PF compliance, automated conflict-free timetable scheduling, CBSE/State report card generation, and multi-branch management.
  - **Live GPS Telemetry**: Real-time school bus tracking with route maps, speed monitoring, and arrival geofence alerts.

---

## Repository Structure

```
.
├── index.html            # Home page (Slider first, interactive phone & ERP mockups, stats, group)
├── about.html            # About Us (Story, mission/vision, values, milestone timeline)
├── schoolmate.html       # Schoolmate product suite deep-dive & accessible FAQ accordion
├── contact.html          # Contact & Demo Request form with client-side validation
├── vercel.json           # Vercel deployment configuration (cleanUrls, caching, security headers)
├── robots.txt            # Search engine crawler instructions
├── sitemap.xml           # XML sitemap for SEO indexing
├── .gitignore            # Git exclusion rules
├── css/
│   ├── style.css         # Shared design system, fluid type, header, footer, floating buttons
│   ├── home.css          # Home-specific layout, slider, phone device, ERP mockup
│   └── pages.css         # Page-specific styling for About, Schoolmate, and Contact
├── js/
│   ├── main.js           # Shared navigation, focus trap, drawer, and scroll-reveal
│   ├── home.js           # Slider, 5-tab phone with sliding pill, ERP module switcher, stats
│   ├── schoolmate.js     # Accessible FAQ accordion handler
│   └── contact.js        # Demo form client-side validation and success state
└── assets/
    ├── favicon.svg       # Brand favicon
    ├── icons.svg         # Centralized 1.75px stroke SVG line icon sprite
    ├── slider-admin.svg  # School Administration ERP illustration
    ├── slider-parents.svg# Android Parent App illustration
    ├── slider-bus.svg    # School bus GPS tracking illustration
    ├── slider-classroom.svg # Smart Classroom & gradebook illustration
    └── slider-fees.svg   # Fees, invoicing & accounts illustration
```

---

## Deployment on Vercel

This repository is optimized for Vercel static hosting:

1. Import this repository (`mdyahhya/opensoftwares`) into your **Vercel Dashboard**.
2. Framework Preset: **Other** (Pure HTML/CSS/JS).
3. Root Directory: `./`
4. Click **Deploy**.
5. Connect your custom domain `opensoftwares.in` in Vercel Project Settings > Domains.

---

## Support & Contacts

- **Phone**: [+91 72047 26501](tel:+917204726501)
- **WhatsApp**: [Chat with us](https://wa.me/917204726501?text=Hi%2C%20I%20want%20to%20know%20more%20about%20school%20software)
- **Email**: [contact@opensoftwares.in](mailto:contact@opensoftwares.in)
- **Copyright**: © OpenSoftwares. All rights reserved.
