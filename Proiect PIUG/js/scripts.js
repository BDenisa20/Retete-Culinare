function schimbaFundal() {
    const body = document.body;
    
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        console.log("Tema a fost schimbată la: Light Mode");
    } else {
        body.classList.add('dark-mode');
        console.log("Tema a fost schimbată la: Dark Mode");
    }
}

document.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-card') || e.target.tagName === 'A') {
        let name = e.target.innerText || e.target.getAttribute('href');
        let count = localStorage.getItem(name) || 0;
        localStorage.setItem(name, parseInt(count) + 1);
        
        console.log(`Butonul "${name}" a fost apăsat de ${localStorage.getItem(name)} ori.`);
    }
});