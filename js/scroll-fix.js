/**
 * Force native mouse-wheel scrolling.
 * The main stylesheet and theme bundle may set #page/body overflow hidden,
 * and the theme bundle may preventDefault() on wheel events. We fix overflow
 * at source (main CSS) and re-apply here; we also handle wheel by scrolling
 * the window when the default was blocked.
 */
(function () {
    'use strict';

    // Wheel: the theme bundle (OverlayScrollbars or similar) often prevents
    // default on wheel, so the window never scrolls. We run after the bundle;
    // in capture phase the bundle runs first and prevents, then we run and
    // manually scroll the window so the page still moves.
    function isScrollableElement(el) {
        if (!el || !el.getBoundingClientRect) return false;
        var cs = window.getComputedStyle(el);
        var overflowY = cs.overflowY || cs.overflow;
        if (overflowY !== 'auto' && overflowY !== 'scroll' && overflowY !== 'overlay') return false;
        return el.scrollHeight > el.clientHeight;
    }

    function hasScrollableAncestor(target) {
        var el = target;
        while (el && el !== document.body) {
            if (isScrollableElement(el)) return true;
            el = el.parentElement;
        }
        return false;
    }

    function onWheel(e) {
        if (hasScrollableAncestor(e.target)) return;
        var dy = e.deltaY;
        if (dy === 0) return;
        var before = window.scrollY;
        requestAnimationFrame(function () {
            if (window.scrollY === before) {
                window.scrollBy(0, dy);
            }
        });
    }

    document.addEventListener('wheel', onWheel, { capture: true, passive: true });

    function applyScrollFix() {
        var page = document.getElementById('page');
        if (page) {
            page.style.setProperty('overflow', 'visible', 'important');
            page.style.setProperty('overflow-x', 'visible', 'important');
            page.style.setProperty('overflow-y', 'visible', 'important');
        }
        document.documentElement.classList.add('scroll-fix-active');
        document.documentElement.style.setProperty('overflow-y', 'auto', 'important');
        document.body.style.setProperty('overflow-y', 'auto', 'important');
        document.body.style.setProperty('overflow-x', 'hidden', 'important');
        document.body.classList.remove('overflow-hidden');
        document.documentElement.classList.remove('overflow-hidden');
    }

    function scheduleApply() {
        applyScrollFix();
        setTimeout(applyScrollFix, 100);
        setTimeout(applyScrollFix, 500);
        setTimeout(applyScrollFix, 1500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', scheduleApply);
    } else {
        scheduleApply();
    }

    // Re-apply if something (e.g. theme bundle) changes overflow after we run
    var observer = new MutationObserver(function () {
        var page = document.getElementById('page');
        var body = document.body;
        var html = document.documentElement;
        if (page && (page.style.overflow === 'hidden' || getComputedStyle(page).overflow === 'hidden')) {
            applyScrollFix();
        }
        if (body && (body.classList.contains('overflow-hidden') || getComputedStyle(body).overflow === 'hidden')) {
            if (!document.getElementById('mobile-menu-overlay') || !document.getElementById('mobile-menu-overlay').classList.contains('active')) {
                applyScrollFix();
            }
        }
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['style', 'class'] });
    var pageEl = document.getElementById('page');
    if (pageEl) {
        observer.observe(pageEl, { attributes: true, attributeFilter: ['style', 'class'] });
    }
})();
