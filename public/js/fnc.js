fetcher = (element,method, target,callback) => {
    target = target ?? document.querySelector('.modal-body');
    target.innerHTML = `<div class="row align-items-center text-center h-100 p-0 m-0" id="content-loader"><div class="col m-auto"><span class="spinner-border" style="width: 5rem; height: 5rem;" ></span></div></div>`
    if(callback)
        callback(target);
    let url = `${element.href || element.getAttribute('data-bz-href')}?auth=${element.getAttribute('data-bz-auth')}`;
    let headers = new Headers({
        'X-BZEZ': url
    })
    fetch(url, {
        method: method ?? 'GET',
        credentials: 'same-origin',
        headers: headers
    }).then(r => {
        // console.log(r.text())
        return r.text()
    }).then(data => {
        // console.log(data)
        target.innerHTML = data;
        setPadding()
        setUrl(element.href)
        setLinksEvent();
        setButtonsEvent();
        initForms();
        // setPreviewEvent();
    })
}
setPadding = (box = document.querySelector('#app .modal-body')) => {
    const scrollbarWidth = document.body.offsetWidth - box.clientWidth;
    box.style.width = box.offsetWidth + scrollbarWidth + 'px';
    box.style.paddingRight = scrollbarWidth + 'px';
}
setUrl = (url) => {
    history.pushState({app: 'app'}, 'Bzez.io - graphicNAIVETY by Sam BZEZ', url)
}
unsetUrl = () => {
    window.history.pushState({app: 'app'}, 'Bzez.io - graphicNAIVETY by Sam BZEZ', window.location.href.split('@')[0])
}
setPreviewEvent = () => {
    document.body.querySelectorAll('[data-bz-preview]').forEach(p => {
        p.addEventListener('click', function (e) {
            let ctn = document.createElement('div');
            let img = document.createElement('img');
            img.classList += 'h-100 rounded-3 shadow-lg border-op-50';
            ctn.classList += 'position-absolute vw-100 vh-100 bg-gradient border-op-50 row align-items-center';
            ctn.style.top = ctn.style.left = '0';
            ctn.style.zIndex = '1337';
            ctn.style.padding = '1.5em';
            let attr = e.currentTarget.getAttribute('data-bz-preview');
            img.src = `${attr}`;
            ctn.appendChild(img);
            document.body.appendChild(ctn);
            ctn.addEventListener('click', function (e) {
                this.remove();
            })
        })
    })
}
linkEvent = (e) => {
    e.preventDefault();
    fetcher(e.currentTarget);
    app.show();
}
setLinksEvent = () => {
    console.log('bug')
    document.querySelectorAll('#app .modal-body a,[role="button"]').forEach(a => {
        // a.removeEventListener("click", this);
        a.addEventListener('click', linkEvent)
    })
}
genLink = (url) => {
    let a = document.createElement('a');
    a.href = url;
    a.setAttribute('data-bz-auth', 'visitor')
    app.show();
    fetcher(a)
    a.remove();
}
setButtonsEvent = () => {
    let spinner = `<span class="spinner-border spinner-border-sm d-none" role="status" aria-hidden="true"></span>`;
    document.querySelectorAll('.btn').forEach(b => {
        b.insertAdjacentHTML('beforeend', spinner);
        b.addEventListener('click', function (e) {
            b.classList.add('disabled')
            let s = b.querySelector('.spinner-border'), i = b.querySelector('i');
            s ? s.classList.remove('d-none') : false;
            i ? i.classList.add('d-none') : false;
            document.onload = () => {
                disableSpinners(b)
            }
            setTimeout(function () {
                disableSpinners(b)
            }, 500)
        })
    })
}
disableSpinners = (el) => {
    let s = el.querySelector('.spinner-border'), i = el.querySelector('i');
    s ? s.classList.add('d-none') : false;
    i ? i.classList.remove('d-none') : false;
    el.classList.remove('disabled')
}