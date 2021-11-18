function formListener(event) {
    console.log(event)
    event.preventDefault();
    let form = event.target;
    // console.log(form)
    if (!form.checkValidity()) {
        event.stopPropagation();
        if (form.classList.contains('estimation-form')) {
            form.querySelectorAll('.dropdown.form-control').forEach(dd => {
                if (!dd.nextElementSibling.value)
                    dd.classList.add('is-invalid')
            });

        } else {
            disableSpinners(event.submitter)
        }
        //
    } else {
        let data = new FormData(form);
        if (form.name === "loginForm") {
            console.log('login')
            fetch(form.action, {
                method: "POST",
                body: data,
                credentials: 'same-origin'
            }).then(r => {
                if (!r.ok) {
                    form.reset();
                    disableSpinners(event.submitter)
                    return r.json()
                }
                return r.text()
            }).then(data => {
                if (data.status !== 400)
                    genLink(window.location.href + '@home');
            })
        } else {
            let target = document.querySelector('#pills-result');
            fetcher(event.submitter, 'POST', target, function (t) {
                document.querySelector('.tab-pane.show.active')?.classList.remove('show', 'active')
                document.querySelector('[data-bs-toggle="pill"].active')?.classList.remove('active')
                t.classList += " show active"
            })
            //Your customs actions if needed...
        }
    }
    form.classList.add('was-validated');
}

function initForms() {
    let forms = document.querySelectorAll('.needs-validation');
    forms.forEach(function (form) {
        form.querySelectorAll('.dropdown.form-control > ul > li').forEach(li => {
            li.addEventListener('click', function (e) {
                let container = li.parentElement.parentElement, button = container.querySelector('button'),
                    input = container.nextElementSibling;
                input.value = li.getAttribute('data-bz-value');
                button.innerHTML = li.getAttribute('data-bz-label');
                if (form.classList.contains('was-validated')) {
                    button.parentElement.classList.remove('is-invalid')
                    button.parentElement.classList.add('is-valid')
                }
            })
        });
        form.addEventListener('submit', formListener, true)
    });
}

initForms();