document.addEventListener('DOMContentLoaded', function () {
    numaraVizitaReteta();
    adaugaFavorite(); // Păstrăm butonul de adăugare la favorite pe carduri
    adaugaSelectorPortii();
    afiseazaCeaMaiVizitata();
    adaugaButonRandom();
    
    // Inițializăm funcționalitatea pentru secțiunea de notițe
    gestioneazaNotite();
});

document.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-card')) {
        let name = e.target.innerText || e.target.getAttribute('href');
        let count = localStorage.getItem(name) || 0;
        localStorage.setItem(name, parseInt(count) + 1);

        console.log(`Butonul "${name}" a fost apăsat de ${localStorage.getItem(name)} ori.`);
    }
});

function numaraVizitaReteta() {
    const reteta = document.querySelector('.reteta');

    if (!reteta) {
        return;
    }

    const titlu = document.querySelector('.titlu-pagina');

    if (!titlu) {
        return;
    }

    const nume = titlu.innerText.trim();
    const cheie = 'vizite_' + nume;
    const vizite = parseInt(localStorage.getItem(cheie)) || 0;

    localStorage.setItem(cheie, vizite + 1);
}

// Funcție păstrată pentru a adăuga butonul de favorite pe carduri
function adaugaFavorite() {
    const carduri = document.querySelectorAll('.card-reteta');

    carduri.forEach(function (card) {
        const titlu = card.querySelector('h3');
        const info = card.querySelector('.card-info');

        if (!titlu || !info || card.querySelector('.btn-favorite')) {
            return;
        }

        const nume = titlu.innerText.trim();
        const buton = document.createElement('button');

        buton.className = 'btn-favorite';

        actualizeazaButonFavorite(buton, nume);

        buton.addEventListener('click', function () {
            modificaFavorite(card, nume, buton);
        });

        info.appendChild(buton);
    });
}

function actualizeazaButonFavorite(buton, nume) {
    const favorite = JSON.parse(localStorage.getItem('favorite')) || [];

    const exista = favorite.some(function (reteta) {
        return reteta.nume === nume;
    });

    if (exista) {
        buton.innerText = '❤️ Elimină de la favorite';
    } else {
        buton.innerText = '♡ Adaugă la favorite';
    }
}

function modificaFavorite(card, nume, buton) {
    let favorite = JSON.parse(localStorage.getItem('favorite')) || [];

    const index = favorite.findIndex(function (reteta) {
        return reteta.nume === nume;
    });

    if (index !== -1) {
        favorite.splice(index, 1);
        buton.innerText = '♡ Adaugă la favorite';
    } else {
        const imagine = card.querySelector('img');
        const link = card.querySelector('.btn-card');
        const categorie = card.querySelector('.categorie');
        const descriere = card.querySelector('p');

        favorite.push({
            nume: nume,
            imagine: imagine ? imagine.src : '',
            link: link ? link.getAttribute('href') : '',
            categorie: categorie ? categorie.innerText : '',
            descriere: descriere ? descriere.innerText : ''
        });

        buton.innerText = '❤️ Elimină de la favorite';
    }

    localStorage.setItem('favorite', JSON.stringify(favorite));
}

// Logica pentru secțiunea de notițe
function gestioneazaNotite() {
    const btnToggle = document.getElementById('btn-toggle-note');
    const sectiuneNotite = document.getElementById('sectiune-notite');
    const btnSalveaza = document.getElementById('btn-salveaza-notita');
    const inputNotita = document.getElementById('input-notita');
    const listaNotite = document.getElementById('lista-notite');

    if (!btnToggle || !sectiuneNotite) return;

    btnToggle.addEventListener('click', function () {
        if (sectiuneNotite.style.display === 'none') {
            sectiuneNotite.style.display = 'block';
            incarcaNotiteSalvate();
        } else {
            sectiuneNotite.style.display = 'none';
        }
    });

    if (btnSalveaza && inputNotita) {
        btnSalveaza.addEventListener('click', function () {
            const text = inputNotita.value.trim();
            if (text === '') return;

            let notite = JSON.parse(localStorage.getItem('notite_culinare')) || [];
            notite.push(text);
            localStorage.setItem('notite_culinare', JSON.stringify(notite));

            inputNotita.value = '';
            incarcaNotiteSalvate();
        });
    }

    function incarcaNotiteSalvate() {
        if (!listaNotite) return;
        let notite = JSON.parse(localStorage.getItem('notite_culinare')) || [];
        
        listaNotite.innerHTML = '';
        if (notite.length === 0) {
            listaNotite.innerHTML = '<p style="color: #636e72;">Nu ai nicio notiță salvată.</p>';
            return;
        }

        notite.forEach(function (notita, index) {
            const element = document.createElement('div');
            element.style.cssText = 'background: #f9f9f9; padding: 10px; margin-top: 8px; border-radius: 5px; display: flex; justify-content: space-between; align-items: center; border-left: 4px solid #e67e22;';
            
            element.innerHTML = `
                <span style="word-break: break-word; margin-right: 10px;">${notita}</span>
                <button data-index="${index}" class="btn-sterge-notita" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; flex-shrink: 0;">Șterge</button>
            `;
            
            listaNotite.appendChild(element);
        });

        const butoaneStergere = listaNotite.querySelectorAll('.btn-sterge-notita');
        butoaneStergere.forEach(function (btn) {
            btn.addEventListener('click', function () {
                const indexDeSters = parseInt(this.getAttribute('data-index'));
                let notite = JSON.parse(localStorage.getItem('notite_culinare')) || [];
                
                notite.splice(indexDeSters, 1);
                localStorage.setItem('notite_culinare', JSON.stringify(notite));
                incarcaNotiteSalvate();
            });
        });
    }
}

function adaugaSelectorPortii() {
    const reteta = document.querySelector('.reteta');

    if (!reteta) {
        return;
    }

    if (document.querySelector('.selector-portii')) {
        return;
    }

    const sectiuni = reteta.querySelectorAll('div');
    let listaIngrediente = null;

    sectiuni.forEach(function (sectiune) {
        const titlu = sectiune.querySelector('h3');

        if (!titlu) {
            return;
        }

        if (titlu.innerText.toLowerCase().includes('ingrediente')) {
            listaIngrediente = sectiune.querySelector('ul');
        }
    });

    if (!listaIngrediente) {
        return;
    }

    const selector = document.createElement('div');

    selector.className = 'selector-portii';

    selector.innerHTML = `
        <label for="portii">🍽️ Număr de porții:</label>
        <select id="portii">
            <option value="1">1 porție</option>
            <option value="2">2 porții</option>
            <option value="4" selected>4 porții</option>
            <option value="6">6 porții</option>
            <option value="8">8 porții</option>
            <option value="10">10 porții</option>
        </select>
    `;

    listaIngrediente.parentElement.insertBefore(selector, listaIngrediente);

    const ingredienteInitiale = Array.from(
        listaIngrediente.querySelectorAll('li')
    ).map(function (li) {
        return li.innerText;
    });

    document.getElementById('portii').addEventListener('change', function () {
        const portiiNoi = parseInt(this.value);
        const factor = portiiNoi / 4;

        listaIngrediente.querySelectorAll('li').forEach(function (li, index) {
            li.innerText = modificaCantitate(
                ingredienteInitiale[index],
                factor
            );
        });
    });
}

function modificaCantitate(text, factor) {
    text = text.replace(
        /(\d+(?:[.,]\d+)?)(\s*[-–]\s*)(\d+(?:[.,]\d+)?)/g,
        function (match, nr1, separator, nr2) {
            const primul = parseFloat(nr1.replace(',', '.'));
            const alDoilea = parseFloat(nr2.replace(',', '.'));

            return formatNumar(primul * factor) +
                separator +
                formatNumar(alDoilea * factor);
        }
    );

    text = text.replace(
        /\d+(?:[.,]\d+)?/g,
        function (numar) {
            const valoare = parseFloat(numar.replace(',', '.'));

            return formatNumar(valoare * factor);
        }
    );

    return text;
}

function formatNumar(numar) {
    const rotunjit = Math.round(numar * 100) / 100;

    if (Number.isInteger(rotunjit)) {
        return String(rotunjit);
    }

    return String(rotunjit).replace('.', ',');
}

function afiseazaCeaMaiVizitata() {
    const grid = document.querySelector('.grid-retete');

    if (!grid) {
        return;
    }

    if (document.querySelector('.cea-mai-vizitata')) {
        return;
    }

    const carduri = grid.querySelectorAll('.card-reteta');

    let ceaMaiVizitata = '';
    let numarVizite = 0;

    carduri.forEach(function (card) {
        const titlu = card.querySelector('h3');

        if (!titlu) {
            return;
        }

        const nume = titlu.innerText.trim();
        const vizite = parseInt(
            localStorage.getItem('vizite_' + nume)
        ) || 0;

        if (vizite > numarVizite) {
            numarVizite = vizite;
            ceaMaiVizitata = nume;
        }
    });

    if (ceaMaiVizitata) {
        const mesaj = document.createElement('div');

        mesaj.className = 'cea-mai-vizitata';

        mesaj.innerHTML =
            '🏆 Cea mai vizitată rețetă: <strong>' +
            ceaMaiVizitata +
            '</strong> - ' +
            numarVizite +
            ' vizitări';

        grid.parentElement.insertBefore(mesaj, grid);
    }
}



function adaugaButonRandom() {
    const grid = document.querySelector('.grid-retete');

    if (!grid) {
        return;
    }

    if (document.querySelector('.buton-random')) {
        return;
    }

    const buton = document.createElement('button');

    buton.className = 'btn-extra buton-random';
    buton.innerText = '🎲 Alege o mâncare';

    grid.parentElement.insertBefore(buton, grid);

    buton.addEventListener('click', function () {
        const carduri = Array.from(
            grid.querySelectorAll('.card-reteta')
        ).filter(function (card) {
            return card.style.display !== 'none';
        });

        if (carduri.length === 0) {
            return;
        }

        const card =
            carduri[Math.floor(Math.random() * carduri.length)];

        const link = card.querySelector('.btn-card');

        if (link) {
            window.location.href = link.getAttribute('href');
        }
    });
}