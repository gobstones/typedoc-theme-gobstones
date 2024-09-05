/** @module @ignore */
/* eslint-disable no-undef */
document.addEventListener('DOMContentLoaded', () => {
    const privateRemarks = document.getElementById('Private Remarks');
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
});
