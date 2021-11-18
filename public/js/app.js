document.querySelector('#menu').addEventListener('show.bs.offcanvas', function () {
   setTimeout(function (){
       genLink('http://localhost/sfrbox/public/@result');
       document.querySelector('[data-bs-dismiss="offcanvas"]').click()
   },1500)
})
document.querySelector('#menu').addEventListener('hide.bs.offcanvas', function () {
    disableSpinners(document.querySelector('[data-bs-toggle="offcanvas"]'))
})
document.body.querySelector('#app').addEventListener('hide.bs.modal',function () {
    console.log(window.location.href.split('@')[0])
    unsetUrl()
})
window.onpopstate = function(event) {
        genLink(document.location)
};
window.onresize = () => {
    console.log('resize')
    setPadding()
}
/*setButtonsEvent();
setLinksEvent();*/
document.body.style.display = 'block';

function toggleResult(){
    fake_photo.remove();
    fake_res.classList.remove('d-none')
}