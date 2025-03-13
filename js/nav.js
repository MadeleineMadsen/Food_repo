document.querySelector('#btnAbout').addEventListener('click', function(e) {
    e.preventDefault();

    let modal = document.querySelector('#about_message');

    if (!modal) {
        modal = document.createElement('dialog');
        modal.id = 'about_message';
        modal.innerHTML = `
            <header>
                <h2>About us</h2>
                <button class="close">&times;</button>
            </header>

            <section>
                <p>Thank you for clicking on me ;)</p>
            </section>
        `;

        modal.querySelector('.close').addEventListener('click', (e) => { //Close button (Hvilket er derfor der er en ".")
            e.preventDefault();
            modal.close();
        });

        modal.addEventListener('close', () => {     //Close event (Hvilket er derfor der ikke er et ".")
            this.blur();    //This refers to the button (the parent)
        });

        document.body.append(modal);
    }
    
    modal.showModal();
});