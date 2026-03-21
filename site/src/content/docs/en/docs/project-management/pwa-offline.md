---
title: "PWA Offline & Updates: Work Anywhere, Stay Current"
description: Learn how SnowB BMF works offline as a Progressive Web App, how automatic updates keep your tool current, and how to manually check for new versions.
schema:
  "@context": "https://schema.org"
  "@type": "TechArticle"
  "headline": "PWA Offline & Updates - SnowB BMF Documentation"
  "datePublished": "2025-01-15"
  "dateModified": "2026-03-21"
  "description": "Complete guide to SnowB BMF's Progressive Web App capabilities: offline usage, automatic updates, manual update checks, and notification states."
  "about":
    "@type": "SoftwareApplication"
    "name": "SnowB BMF"
    "applicationCategory": "DesignApplication"
  "isPartOf":
    "@type": "WebSite"
    "name": "SnowB BMF Documentation"
    "url": "https://snowb.org"
  "author":
    "@type": "Person"
    "name": "SilenceLeo"
    "url": "https://github.com/SilenceLeo/"
  "inLanguage": "en"
  "publisher":
    "@type": "Organization"
    "name": "SnowB"
    "url": "https://snowb.org"
  "mainEntityOfPage":
    "@type": "WebPage"
    "@id": "https://snowb.org/en/docs/project-management/pwa-offline/"
  "audience":
    "@type": "Audience"
    "audienceType": "Game Developers and Web Developers"
  "teaches":
    - "How to use SnowB BMF offline"
    - "How application updates work"
    - "How to manually check for updates"
    - "Understanding PWA offline capabilities"
  "articleSection": "Documentation"
  "keywords": ["PWA", "progressive web app", "offline", "service worker", "app update", "bitmap font tool", "SnowB BMF", "offline first", "web application"]
  "mainEntity":
    "@type": "HowTo"
    "name": "How to Use SnowB BMF Offline and Manage Updates"
    "description": "Step-by-step guide to working offline with SnowB BMF and keeping the application up to date"
    "step":
      - "@type": "HowToStep"
        "name": "Load the Application"
        "text": "Open SnowB BMF in your browser. The Service Worker automatically caches all application resources on first load."
      - "@type": "HowToStep"
        "name": "Confirm Offline Readiness"
        "text": "Look for the 'App is ready for offline use' success notification at the bottom left of the screen."
      - "@type": "HowToStep"
        "name": "Work Offline"
        "text": "Once cached, use SnowB BMF without an internet connection. All features work locally with data stored in IndexedDB."
      - "@type": "HowToStep"
        "name": "Update When Available"
        "text": "When a new version is detected, click the Update button in the notification to apply it."
---

## Offline Capability

SnowB BMF works fully offline after your first visit. A **Service Worker** caches all application resources (HTML, CSS, JavaScript, fonts, icons). After that, you can create and edit bitmap fonts without an internet connection.

### How Offline Mode Works

1. **First visit**: The browser downloads and caches all application files via the Service Worker.
2. **Offline ready notification**: A green success notification appears at the bottom left: **"App is ready for offline use"**. This notification automatically dismisses after 5 seconds.
3. **Subsequent visits**: The application loads entirely from the local cache, regardless of network availability.

### Local Data Storage

All your project data is stored in the browser's **IndexedDB** database, not on a remote server. This means:

- Your fonts and projects are always available locally.
- No data is sent to or stored on external servers.
- Projects persist across browser sessions (unless browser data is cleared).

For more details on data persistence, see [Project Operations](/en/docs/project-management/project-operations/).

## Application Updates

When online, the Service Worker detects new versions automatically. Updates are non-disruptive: you choose when to apply them.

### Automatic Update Detection

The Service Worker checks for new versions in the background. When it finds one, notifications walk you through the process:

1. **Update downloading**: An info notification appears with a refresh icon: the new version is being downloaded in the background.
2. **Update ready**: A warning notification appears: **"New version available, click update to experience now"** with an **Update** button.
3. **Applying the update**: Click **Update** to apply. A loading indicator shows **"Updating to new version..."** while the update is applied.
4. **Update complete**: The page automatically refreshes with the new version.

### Update Failure

If the update fails, an error notification appears with a **Retry** button. Click **Retry** to attempt the update again. If the problem persists, try refreshing the page or clearing the browser cache.

## Manual Update Check

You can check for updates manually at any time through the notification panel.

### How to Check

1. The notification panel displays a **"Check for Updates"** button.
2. Click it to trigger a manual check. A loading spinner appears while checking.
3. If a new version is found, the update notification appears as described above.
4. If no new version is available, the notification automatically closes after 2 seconds.
5. The notification displays **"Last checked: {time}"** showing when you last checked.

### Check Failure

If the manual check fails (e.g., due to network issues), an error notification appears: **"Failed to check for updates"** with a **Retry** button.

## Notification States Reference

Color-coded notifications at the bottom left show Service Worker and update status:

| State | Severity | Icon | Message | Action |
|-------|----------|------|---------|--------|
| Offline ready | Success (green) | Checkmark | "App is ready for offline use" | Auto-dismisses after 5 seconds |
| Update downloading | Info (blue) | Refresh | Downloading new version | None (automatic) |
| Update ready | Warning (yellow) | Update arrow | "New version available, click update to experience now" | **Update** button |
| Updating | Warning (yellow) | Loading spinner | "Updating to new version..." | Button disabled during update |
| Update failed | Error (red) | Error icon | Error message | **Retry** button |
| Check failed | Error (red) | Error icon | "Failed to check for updates" | **Retry** button |

All notifications can be manually dismissed by clicking the close (X) button, except they will not close if you click outside the notification area (clickaway is ignored).

## Related Topics

- [Project Operations](/en/docs/project-management/project-operations/)
