document.querySelector('#menu').addEventListener('show.bs.offcanvas', function () {

    // Get the video element

// Check if device has camera
    /*navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

    navigator.getMedia({video: !0, audio: !1}, function (stream) {
        if ('srcObject' in video) {
            video.srcObject = stream;
        } else {
            video.src = vu.createObjectURL(stream);
        }
        video.play();
    }, function (error) {
        if (window.console)
            console.error(error);
    });

    video.addEventListener('canplay', function (ev) {
        if (!streaming) {
            video.setAttribute('style', 'margin-left:-33vh;');
            height = video.videoHeight / (video.videoWidth / width);
            video.setAttribute('width', width);
            video.setAttribute('height', height);
            streaming = !0;
        }
    }, !1);*/
})
document.querySelector('#menu').addEventListener('hide.bs.offcanvas', function () {
    const video = document.querySelector('#video')
    video.srcObject = null;
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