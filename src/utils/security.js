/**
 * Website Security Protection Module (Maximum Standard)
 * 
 * Protects against:
 * - F12 DevTools opening
 * - Ctrl+Shift+I / J / C / K (Inspect Element, Console, Inspector)
 * - Ctrl+U / Cmd+Option+U (View Page Source)
 * - Ctrl+S (Save Webpage)
 * - Right-click Context Menu
 * - DevTools Inspection Freeze Trap (Infinite debugger trap)
 * - Console Snooping & Scraping
 */

export function initWebsiteSecurity() {
  if (typeof window === 'undefined') return;

  // 1. Print Warning Banner in Console
  try {
    const bannerTitle = 'color: #ff0055; font-size: 22px; font-weight: 900; text-shadow: 1px 1px 0px black;';
    const bannerText = 'color: #4b5563; font-size: 13px; font-weight: bold; line-height: 1.6;';
    console.clear();
    console.log('%c⛔ คำเตือนความปลอดภัยสูงสุด (Security Protection)', bannerTitle);
    console.log(
      '%cเว็บไซต์นี้ได้รับการคุ้มครองด้วยระบบรักษาความปลอดภัยระดับสูงสุด\n' +
      'ห้ามคัดลอก ดัดแปลง เจาะระบบ หรือนำ Source Code ไปใช้โดยเด็ดขาด\n' +
      'All rights reserved.',
      bannerText
    );
  } catch (_) {}

  // 2. Disable Right-Click Context Menu
  window.addEventListener(
    'contextmenu',
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    },
    true
  );

  // 3. Disable DevTools & Source Inspection Keyboard Shortcuts
  window.addEventListener(
    'keydown',
    (e) => {
      // F12
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      const isCtrlOrMeta = e.ctrlKey || e.metaKey;

      // Ctrl+Shift+I (Inspect), Ctrl+Shift+J (Console), Ctrl+Shift+C (Element picker), Ctrl+Shift+K (Firefox)
      if (
        isCtrlOrMeta &&
        e.shiftKey &&
        ['i', 'I', 'j', 'J', 'c', 'C', 'k', 'K'].includes(e.key)
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+U / Cmd+U (View Page Source)
      if (isCtrlOrMeta && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+S / Cmd+S (Save Webpage)
      if (isCtrlOrMeta && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+P (Print webpage)
      if (isCtrlOrMeta && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    },
    true
  );

  // 4. Anti-DevTools Active Debugger Trap
  // When DevTools is closed, this statement runs in microseconds without effect.
  // When DevTools is opened, this statement halts the browser in an inescapable breakpoint loop!
  const activateDebuggerTrap = () => {
    try {
      (function () {
        return false;
      }['constructor']('debugger')());
    } catch (_) {}
  };

  // Run periodic debugger checks
  setInterval(activateDebuggerTrap, 250);

  // 5. DevTools Open Detection via Dimension
  let isDevToolsOpen = false;
  const checkDevTools = () => {
    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;

    if (widthThreshold || heightThreshold) {
      if (!isDevToolsOpen) {
        isDevToolsOpen = true;
        activateDebuggerTrap();
      }
    } else {
      isDevToolsOpen = false;
    }
  };

  window.addEventListener('resize', checkDevTools);
  setInterval(checkDevTools, 1000);

  // 6. Disable Dragging of images
  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
    }
  });
}
