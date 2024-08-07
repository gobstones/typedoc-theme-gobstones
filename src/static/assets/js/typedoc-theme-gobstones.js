/* eslint-disable no-undef */
document.addEventListener('DOMContentLoaded', function () {
    const privateRemarks = document.getElementById('Private Remarks');
    if (!privateRemarks) return;
    const privateRemarksTitle = privateRemarks.parentElement;
    const privateRemarksText = privateRemarksTitle.nextElementSibling;
    privateRemarksTitle.classList.add('tsd-is-internal');
    privateRemarksTitle.classList.add('tsd-private-remarks');
    privateRemarksText.classList.add('tsd-is-internal');
    privateRemarksText.classList.add('tsd-private-remarks');
});
