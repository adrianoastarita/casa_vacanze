const allImages = [
  '/assets/booking/icon_left.png',
  '/assets/booking/icon_right.png',
  
  '/assets/gallery/pic_gallery_1.jpeg',
  '/assets/gallery/pic_gallery_2.jpeg',
  '/assets/gallery/pic_gallery_3.jpeg',
  '/assets/gallery/pic_gallery_4.jpeg',
  '/assets/gallery/pic_gallery_5.jpeg',
  '/assets/gallery/pic_gallery_6.jpeg',

  '/assets/header/icon_ics.png',
  '/assets/header/icon_left.png',
  '/assets/header/icon_menu.png',
  '/assets/header/icon_right.png',

  '/assets/intro/pic_intro_1.jpeg',
  '/assets/intro/pic_intro_2.jpeg',
  '/assets/intro/pic_intro_3.jpeg',

  '/assets/location/pic_location_1.jpeg',

  '/assets/reviews/icon_user.png',

  '/assets/services/icon_services_1.png',
  '/assets/services/icon_services_2.png',
  '/assets/services/icon_services_3.png',
  '/assets/services/icon_services_4.png',

];

function preloadImages(imagePaths) {
  return Promise.all(
    imagePaths.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = reject;
      });
    })
  );
}

// Funzione per gestire il menu
function initializeMenu() {
  const menuToggle = document.getElementById("menu-toggle");
  const modalOverlay = document.getElementById("modal-overlay");
  const closeModalButton = document.getElementById("close-modal");
  const navMenuLinks = document.querySelectorAll(".nav-menu a");

  if (menuToggle && modalOverlay && closeModalButton) {
    console.log("Menu e modalOverlay trovati!");

    // Mostra il modal al click dell'icona del menu
    menuToggle.addEventListener("click", () => {
      console.log("Icona menu cliccata!");
      modalOverlay.style.display = "flex"; // Mostra il modal
    });

    // Chiudi il modal quando si clicca sulla "X"
    closeModalButton.addEventListener("click", () => {
      modalOverlay.style.display = "none"; // Nascondi il modal
    });

    // Chiudi il modal quando si clicca su un link del menu
    navMenuLinks.forEach(link => {
      link.addEventListener("click", () => {
        modalOverlay.style.display = "none"; // Nascondi il modal
      });
    });
      
  } else {
    console.log("menuToggle o modalOverlay non trovati!");
  }
}

// Carica l'header staticamente da file
fetch(`sections/header.html`)
  .then(res => res.text())
  .then(html => {
    const div = document.createElement("div");
    div.innerHTML = html;
    document.getElementById("header-container").appendChild(div);

    // Una volta che l'header è stato caricato, inizializza il menu
    initializeMenu();  // Chiamata alla funzione che gestisce il menu
  })
  .catch(err => console.error(`Errore nel caricamento di "header.html" ":`, err));




const contentContainer = document.getElementById("content-container");

preloadImages(allImages)
  .then(() => {
    // Una volta caricate tutte le immagini, inizia il caricamento delle sezioni
    return fetch(`sections/intro.html`);
  })
  .then(res => res.text())
  .then(html => {
    const div = document.createElement("div");
    div.innerHTML = html;
    contentContainer.appendChild(div);

    setIntroHeight();
    window.addEventListener('resize', setIntroHeight);

    setupArrowListeners();

    return fetch(`sections/gallery.html`);
  })
  .then(res => res.text())
  .then(html => {
    const div = document.createElement("div");
    div.innerHTML = html;
    contentContainer.appendChild(div);
    return fetch(`sections/location.html`);
  })
  .then(res => res.text())
  .then(html => {
    const div = document.createElement("div");
    div.innerHTML = html;
    contentContainer.appendChild(div);
    return fetch(`sections/services.html`);
  })
  .then(res => res.text())
  .then(html => {
    const div = document.createElement("div");
    div.innerHTML = html;
    contentContainer.appendChild(div);
    return fetch(`sections/booking.html`);
  })
  .then(res => res.text())
  .then(html => {
    const div = document.createElement("div");
    div.innerHTML = html;
    contentContainer.appendChild(div);
    initCalendar(); // Inizializza il calendario dopo che la sezione è stata aggiunta
    return fetch(`sections/reviews.html`);
  })
  .then(res => res.text())
  .then(html => {
    const div = document.createElement("div");
    div.innerHTML = html;
    contentContainer.appendChild(div);
  })
  .catch(err => console.error("Errore nel caricamento delle sezioni o immagini:", err));

// Imposta altezza della sezione intro
function setIntroHeight() {
  const intro = document.querySelector('.intro');
  if (intro) {
    intro.style.height = `${window.innerHeight}px`;
  }
}

// Aggiunge il comportamento delle frecce
function setupArrowListeners() {
  const images = [
    '/assets/intro/pic_intro_1.jpeg',
    '/assets/intro/pic_intro_2.jpeg',
    '/assets/intro/pic_intro_3.jpeg'
  ];

  let currentIndex = 0;

  function changeBackground(index) {
    document.querySelector('.intro').style.backgroundImage = `url('${images[index]}')`;
  }

  const prevArrow = document.getElementById('prev-arrow');
  const nextArrow = document.getElementById('next-arrow');

  if (prevArrow && nextArrow) {
    prevArrow.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      changeBackground(currentIndex);
    });

    nextArrow.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % images.length;
      changeBackground(currentIndex);
    });
  }
}

// Carica immagine di sfondo e attende completamento
function loadBackgroundImage() {
  return new Promise((resolve, reject) => {
    const images = [
      '/assets/intro/pic_intro_1.jpeg',
      '/assets/intro/pic_intro_2.jpeg',
      '/assets/intro/pic_intro_3.jpeg'
    ];

    const image = new Image();
    image.src = images[0];

    image.onload = () => {
      document.querySelector('.intro').style.backgroundImage = `url('${images[0]}')`;
      resolve();
    };

    image.onerror = () => {
      console.error("Errore nel caricamento dell'immagine di sfondo.");
      reject();
    };
  });
}

// Inizializza e disegna il calendario
function initCalendar() {
  const monthYear = document.getElementById('month-name');
  const calendarBody = document.getElementById('calendar-grid');
  const prevMonthBtn = document.getElementById('prev-month');
  const nextMonthBtn = document.getElementById('next-month');

  if (!monthYear || !calendarBody || !prevMonthBtn || !nextMonthBtn) return;

  let currentDate = new Date();

  function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    const monthNames = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
      'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
    monthYear.textContent = `${monthNames[month]} ${year}`;

    calendarBody.innerHTML = '';

    const firstDay = new Date(year, month, 1);
    const startingDay = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Spazi vuoti prima dell'inizio del mese
    for (let i = 0; i < startingDay; i++) {
      const emptyDiv = document.createElement('div');
      emptyDiv.textContent = '';
      calendarBody.appendChild(emptyDiv);
    }

    // Giorni del mese
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDiv = document.createElement('div');
      dayDiv.textContent = day;
      calendarBody.appendChild(dayDiv);
    }
  }

  prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
  });

  nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
  });

  renderCalendar(currentDate);
}

