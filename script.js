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

  '/assets/intro/pic_intro.jpeg',

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

const allVideos = [
  '/assets/intro/video_intro.mp4',
];

function preloadImages(imagePaths) {
  return Promise.all(
    imagePaths.map((src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = resolve; // risolvi comunque per non bloccare
      });
    })
  );
}

function setInitialBackground() {
  const image = '/assets/intro/pic_intro.jpeg';
  const section = document.querySelector('.intro');
  if (section) {
    section.style.backgroundImage = `url(${image})`;
  }
}

function preloadVideos(videoPaths, timeoutMs = 2000) {
  console.log('loading videos...');
  console.log(`Numero di video da caricare: ${videoPaths.length}`);

  return Promise.all(
    videoPaths.map((src, index) => {
      return Promise.race([
        new Promise((resolve) => {
          const video = document.createElement('video');
          console.log(`Inizio caricamento video: ${src}, index: ${index}`);

          video.onloadeddata = () => {
            console.log(`Video caricato correttamente: ${src}`);
            resolve();
          };

          video.onerror = (err) => {
            console.warn(`Errore nel caricamento video: ${src}`, err);
            resolve(); // fallback: non bloccare tutto
          };

          video.src = src;
          video.preload = 'auto';
          video.load();
          console.log(`Avvio il caricamento per il video: ${src}`);
        }),
        new Promise(resolve => {
          setTimeout(() => {
            console.warn(`Timeout nel caricamento video: ${src}`);
            resolve();
          }, timeoutMs);
        })
      ]);
    })
  );
}

function appendHTMLToContainer(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  document.getElementById("content-container").appendChild(div);
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
      menuToggle.style.display = "block";
    });

    navMenuLinks.forEach(link => {
      link.addEventListener("click", () => {
        modalOverlay.style.display = "none";
        menuToggle.style.display = "block";
      });
    });
  } else {
    console.log("menuToggle o modalOverlay non trovati!");
  }
}

function setIntroHeight() {
  const intro = document.querySelector('.intro');
  if (intro) {
    intro.style.height = `${window.innerHeight}px`;
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
    appendHTMLToContainer(html);
    setIntroHeight();
    window.addEventListener('resize', setIntroHeight);
    setInitialBackground();
    return preloadVideos(allVideos);
  })
  .then(() => fetch(`sections/gallery.html`))
  .then(res => res.text())
  .then(html => {
    appendHTMLToContainer(html);
    initializeGalleryModal();
  })
  .then(() => fetch(`sections/location.html`))
  .then(res => res.text())
  .then(appendHTMLToContainer)
  .then(() => fetch(`sections/services.html`))
  .then(res => res.text())
  .then(html => {
    appendHTMLToContainer(html);
    initServicesModal();
  })
  .then(() => fetch(`sections/booking.html`))
  .then(res => res.text())
  .then(html => {
    appendHTMLToContainer(html);
    initCalendar();
    return fetch(`sections/reviews.html`);
  })
  .then(res => res.text())
  .then(appendHTMLToContainer)
  .then(() => fetch(`sections/contacts.html`))
  .then(res => res.text())
  .then(appendHTMLToContainer)
  .catch(err => console.error("Errore nel caricamento delle sezioni o immagini:", err));

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

fetch('sections/gallerymodal.html')
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

function initializeGalleryModal() {
  const galleryModal = document.getElementById('galleryModal');
  const galleryModalItemsContainer = galleryModal.querySelector('.gallery-modal-items-container');
  const closeBtn = galleryModal.querySelector('.gallery-modal-close');
  const images = document.querySelectorAll('.gallery-clickable-image');
  if (!galleryModal || !galleryModalItemsContainer || !images.length) return;
  images.forEach((img, index) => {
    img.addEventListener('click', () => {
      openGalleryModal(index);
    });
  });
  function openGalleryModal(clickedIndex) {
    galleryModalItemsContainer.innerHTML = '';
    images.forEach((img, i) => {
      const clone = img.cloneNode();
      if (i === clickedIndex) clone.classList.add('active');
      galleryModalItemsContainer.appendChild(clone);
    });
    galleryModal.classList.add('show');
    setTimeout(() => {
      const activeImg = galleryModalItemsContainer.querySelector('.active');
      if (activeImg) {
        activeImg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }
  closeBtn.addEventListener('click', () => {
    galleryModal.classList.remove('show');
  });
}

function initServicesModal() {
  const modal = document.getElementById("servicesModal");
  const closeBtn = modal?.querySelector(".services-modal-close");
  const thumbnails = document.querySelectorAll(".services-container img");
  const detailImages = document.querySelectorAll(".services-modal-items-container img");

  if (!modal || thumbnails.length === 0) return;

  thumbnails.forEach((thumb, index) => {
    thumb.addEventListener("click", () => {
      modal.classList.add("show");
      const targetImage = detailImages[index];
      if (targetImage) {
        const container = document.querySelector(".services-modal-items-container");
        const containerWidth = container.offsetWidth;
        const imageLeft = targetImage.offsetLeft;
        const imageWidth = targetImage.offsetWidth;
        const scrollTo = imageLeft - (containerWidth / 2) + (imageWidth / 2);
        container.scrollTo({ left: scrollTo, behavior: "smooth" });
      }
    });
  });

  closeBtn?.addEventListener("click", () => {
    modal.classList.remove("show");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("show");
    }
  });
}
