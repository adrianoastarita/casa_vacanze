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

  '/assets/contacts/icon_address.png',
  '/assets/contacts/icon_phone.png',
  '/assets/contacts/icon_email.png',
  '/assets/contacts/icon_instagram.png',
  '/assets/contacts/icon_cir.png',

  
  '/assets/modal/icon_ics.png',
  '/assets/modal/icon_left.png',
  '/assets/modal/icon_right.png',
];


// Funzione per cambiare lo sfondo
let currentIndex = 0;
function changeBG() {
  const images = [
    '/assets/intro/pic_intro_1.jpeg',
    '/assets/intro/pic_intro_2.jpeg',
    '/assets/intro/pic_intro_3.jpeg',
  ];
  const section = document.querySelector('.intro');
  if (section) {
    section.style.backgroundImage = `url(${images[currentIndex]})`;
    // Incrementiamo l'indice per il prossimo ciclo
    currentIndex = (currentIndex + 1) % images.length;  // Torna all'inizio quando arriva alla fine
  }
}

// Funzione per caricare l'immagine iniziale
function setInitialBackground() {
  const images = [
    '/assets/intro/pic_intro_1.jpeg',
    '/assets/intro/pic_intro_2.jpeg',
    '/assets/intro/pic_intro_3.jpeg',
  ];

  const section = document.querySelector('.intro');
  if (section) {
    section.style.backgroundImage = `url(${images[currentIndex]})`; // Impostiamo la prima immagine subito
  }
}

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

function initializeMenu() {
  const menuToggle = document.getElementById("menu-toggle");
  const modalOverlay = document.getElementById("modal-overlay");
  const closeModalButton = document.getElementById("close-modal");
  const navMenuLinks = document.querySelectorAll(".nav-menu a");

  if (menuToggle && modalOverlay && closeModalButton) {
    menuToggle.addEventListener("click", () => {
      modalOverlay.style.display = "flex";
      menuToggle.style.display = "none";
    });

    closeModalButton.addEventListener("click", () => {
      modalOverlay.style.display = "none";
      menuToggle.style.display = "block"; // Mostra di nuovo il bottone
    });

    navMenuLinks.forEach(link => {
      link.addEventListener("click", () => {
        modalOverlay.style.display = "none";
        menuToggle.style.display = "block"; // Mostra di nuovo il bottone
      });
    });
  } else {
    console.log("menuToggle o modalOverlay non trovati!");
  }
}

fetch(`sections/header.html`)
  .then(res => res.text())
  .then(html => {
    const div = document.createElement("div");
    div.innerHTML = html;
    document.getElementById("header-container").appendChild(div);
    initializeMenu();
  })
  .catch(err => console.error(`Errore nel caricamento di "header.html":`, err));

const contentContainer = document.getElementById("content-container");

preloadImages(allImages)
  .then(() => fetch(`sections/intro.html`))
  .then(res => res.text())
  .then(html => {
    const div = document.createElement("div");
    div.innerHTML = html;
    contentContainer.appendChild(div);
    setIntroHeight();
    window.addEventListener('resize', setIntroHeight);
    setInitialBackground();
    // Chiamata alla funzione changeBG per cambiare sfondo randomicamente
    setInterval(changeBG, 3000);  // Cambia l'immagine ogni 2 secondi
    return fetch(`sections/gallery.html`);
  })
  .then(res => res.text())
  .then(html => {
    const div = document.createElement("div");
    div.innerHTML = html;
    contentContainer.appendChild(div);
    // Inizializza il modal solo dopo che la gallery è caricata
    initializeVerticalModal();
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
    initCalendar();
    return fetch(`sections/reviews.html`);
  })
  .then(res => res.text())
  .then(html => {
    const div = document.createElement("div");
    div.innerHTML = html;
    contentContainer.appendChild(div);
    return fetch(`sections/contacts.html`);
  })
  .then(res => res.text())
  .then(html => {
    const div = document.createElement("div");
    div.innerHTML = html;
    contentContainer.appendChild(div);
  })
  .catch(err => console.error("Errore nel caricamento delle sezioni o immagini:", err));

function setIntroHeight() {
  const intro = document.querySelector('.intro');
  if (intro) {
    intro.style.height = `${window.innerHeight}px`;
  }
}

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
    for (let i = 0; i < startingDay; i++) {
      const emptyDiv = document.createElement('div');
      calendarBody.appendChild(emptyDiv);
    }
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

// Carica il modal HTML
fetch('sections/verticalmodal.html')
  .then(response => response.text())
  .then(html => {
    const placeholder = document.getElementById('modal-placeholder');
    if (placeholder) {
      placeholder.innerHTML = html;
    } else {
      console.error("modal-placeholder non trovato nel DOM.");
    }
  })
  .catch(err => console.error("Errore nel caricamento di modal.html:", err));

// Inizializza il modal una volta che le immagini sono nel DOM
function initializeVerticalModal() {
  const verticalModal = document.getElementById('verticalModal');
  const verticalScroll = verticalModal.querySelector('.vertical-scroll');
  const closeBtn = verticalModal.querySelector('.vertical-close');
  const images = document.querySelectorAll('.clickable-image');
  if (!verticalModal || !verticalScroll || !images.length) return;
  images.forEach((img, index) => {
    img.addEventListener('click', () => {
      openVerticalModal(index);
    });
  });
  function openVerticalModal(clickedIndex) {
    verticalScroll.innerHTML = ''; // Reset
    images.forEach((img, i) => {
      const clone = img.cloneNode();
      if (i === clickedIndex) clone.classList.add('active');
      verticalScroll.appendChild(clone);
    });
    verticalModal.classList.add('show');
    // Scrolla l'immagine cliccata al centro
    setTimeout(() => {
      const activeImg = verticalScroll.querySelector('.active');
      if (activeImg) {
        activeImg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }
  closeBtn.addEventListener('click', () => {
    verticalModal.classList.remove('show');
  });
}

