document.querySelector('#menu').addEventListener('show.bs.offcanvas', function () {
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
        genLink('http://localhost/sfrbox/public/@result')
        document.querySelector('[data-bs-dismiss="offcanvas"]').click();
    };
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback);
})
document.querySelector('#menu').addEventListener('hide.bs.offcanvas', function () {
    html5QrCode.stop();
    disableSpinners(document.querySelector('[data-bs-toggle="offcanvas"]'))
})
document.body.querySelector('#app').addEventListener('hide.bs.modal', function () {
    console.log(window.location.href.split('@')[0])
    unsetUrl()
})
window.onpopstate = function (event) {
    genLink(document.location)
};
window.onresize = () => {
    console.log('resize')
    setPadding()
}
setButtonsEvent();
setLinksEvent();
document.body.style.display = 'block';

function toggleResult() {
    fake_photo.remove();
    fake_res.classList.remove('d-none')
}