/** @module @ignore */
/* eslint-disable no-undef */

const onNavbarLoaded = (callback) => {
    document.addEventListener('DOMContentLoaded', () => {
        const isNavbarLoaded = () => {
            const navbar = document.querySelector('nav.tsd-navigation #tsd-nav-container');
            const notLoaded =
                navbar.children.length === 0 ||
                (navbar.children.length === 1 && navbar.children[0].textContent === 'Loading...');
            return !notLoaded;
        };
        const startTimeout = () => {
            setTimeout(() => {
                if (isNavbarLoaded()) {
                    callback();
                } else {
                    startTimeout();
                }
            }, 10);
        };
        startTimeout();
    });
};

const markPrivateRemarksAsInternal = () => {
    const privateRemarks = document.getElementById('private-remarks');
    if (!privateRemarks) return;
    const privateRemarksTitle = privateRemarks.parentElement;
    privateRemarksTitle.classList.add('tsd-is-internal');
    privateRemarksTitle.classList.add('tsd-private-remarks');

    let privateRemarksText = privateRemarksTitle.nextElementSibling;
    while (privateRemarksText) {
        privateRemarksText.classList.add('tsd-is-internal');
        privateRemarksText.classList.add('tsd-private-remarks');
        privateRemarksText = privateRemarksText.nextElementSibling;
    }
};

const fixIncorrectCurrent = () => {
    const anchorsInNavbar = document.querySelectorAll('nav.tsd-navigation a');
    for (const a of anchorsInNavbar) {
        if (a.pathname === window.location.pathname || a.pathname === `${window.location.pathname}.html`) {
            a.classList.add('current');
        }
    }
};

onNavbarLoaded(() => {
    fixIncorrectCurrent();
    markPrivateRemarksAsInternal();
    window.app.ensureActivePageVisible();
});
