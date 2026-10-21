# Open Softwares — Official Website

> **Domain:** [opensoftwares.in](https://opensoftwares.in)  
> **Flagship Product:** SchoolMate by Open Softwares (Android App + Web ERP)

A production-ready, multi-page static website built with pure semantic **HTML5**, **CSS3**, and **vanilla JavaScript**. Engineered with zero external dependencies, no frameworks, and no build tools. Ready for zero-configuration instant deployment on **Vercel**.

---

## 🌟 Overview

Open Softwares is a group of companies managing software in the education, manufacturing, and real estate industries. This website showcases our primary live flagship product:

- **SchoolMate by Open Softwares**:
  - **Native Android App**: Real-time push alerts, homework, one-tap UPI fee receipts, and direct parent-teacher communication.
  - **Web ERP for Administration**: Biometric staff attendance, payroll with Maharashtra PT/PF compliance, automated conflict-free timetable scheduling, CBSE/State report card generation, and multi-branch management.
  - **Live GPS Telemetry**: Real-time school bus tracking with route maps, speed monitoring, and arrival geofence alerts.

---

## 📁 Repository Structure

```
.
├── index.html            # Home page (Hero, image slider, mockups, stats, testimonials, group)
├── about.html            # About Us (Story, mission/vision, values, milestone timeline)
├── schoolmate.html       # SchoolMate product suite deep-dive & accessible FAQ accordion
├── contact.html          # Contact & Demo Request form with client-side validation
├── vercel.json           # Vercel deployment configuration (cleanUrls, caching, security headers)
├── robots.txt            # Search engine crawler instructions
├── sitemap.xml           # XML sitemap for SEO indexing
├── .gitignore            # Git exclusion rules
├── css/
│   ├── style.css         # Shared design system, variables, header, footer, floating buttons
│   ├── home.css          # Home-specific layout, slider, mockups, and counter animations
│   └── pages.css         # Page-specific styling for About, SchoolMate, and Contact
├── js/
│   ├── main.js           # Shared navigation, focus trap, drawer, and scroll-reveal
│   ├── home.js           # Touch slider, phone mockup screen cycler, ERP tabs, stats counters
│   ├── schoolmate.js     # Accessible FAQ accordion handler
│   └── contact.js        # Demo form client-side validation and success state
└── assets/
    ├── favicon.svg       # Brand favicon
    ├── slider-admin.svg  # School Administration ERP illustration
    ├── slider-parents.svg# Android Parent App illustration
    ├── slider-bus.svg    # School bus GPS tracking illustration
    └── slider-classroom.svg # Smart Classroom & gradebook illustration
```

---

## 🚀 Deployment on Vercel

This repository is optimized for Vercel static hosting:

1. Import this repository (`mdyahhya/opensoftwares`) into your **Vercel Dashboard**.
2. Framework Preset: **Other** (Pure HTML/CSS/JS).
3. Root Directory: `./`
4. Click **Deploy**.
5. Connect your custom domain `opensoftwares.in` in Vercel Project Settings > Domains.

---

## 📞 Support & Contacts

- **Phone**: [+91 72047 26501](tel:+917204726501)
- **WhatsApp**: [Chat with us](https://wa.me/917204726501?text=Hi%2C%20I%20want%20to%20know%20more%20about%20school%20software)
- **Email**: [contact@opensoftwares.in](mailto:contact@opensoftwares.in)
- **Copyright**: © Open Softwares. All rights reserved.
