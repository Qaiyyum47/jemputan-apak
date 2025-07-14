// document.addEventListener("DOMContentLoaded", () => {
//   document.getElementById("main-content").style.display = "block";
// });

// ===== POPUP CONTROL =====
function toggleSection(sectionId) {
  closePopup();
  document.getElementById('popup-overlay').classList.add('active');
  document.getElementById('popup-' + sectionId).classList.add('active');
  document.body.classList.add('no-scroll');
}

function closePopup() {
  document.getElementById('popup-overlay').classList.remove('active');
  const popups = document.querySelectorAll('.popup-section');
  popups.forEach(p => p.classList.remove('active'));
  document.body.classList.remove('no-scroll');
}

let currentSlide = 0;
const slides = document.querySelectorAll(".carousel img");
const dots = document.querySelectorAll(".dot");

function setSlide(index) {
  currentSlide = index;
  updateCarousel();
}

function updateCarousel() {
  const slideWidth = document.querySelector(".carousel-wrapper").offsetWidth;
  const carousel = document.querySelector(".carousel");
  carousel.style.transform = `translateX(-${currentSlide * slideWidth}px)`;

  dots.forEach(dot => dot.classList.remove("active"));
  if (dots[currentSlide]) dots[currentSlide].classList.add("active");
}

function autoSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  updateCarousel();
}

window.addEventListener("resize", updateCarousel); // Recalculate on resize
setInterval(autoSlide, 4000);

let confirmCallback = null;

function showCustomConfirm(message, callback) {
  document.getElementById("confirm-message").textContent = message;
  document.getElementById("confirm-popup").classList.add("active");
  confirmCallback = callback;
}

function handleConfirm(choice) {
  document.getElementById("confirm-popup").classList.remove("active");
  if (confirmCallback) confirmCallback(choice);
}


// ===== RSVP STEP CONTROL =====
function setAttendance(status) {
  const confirmMsg = "Anda memilih: " + status + ", Teruskan?";
  
  showCustomConfirm(confirmMsg, function(confirmed) {
    if (confirmed) {
      document.getElementById("hadir-status").value = status;
      document.getElementById("attendance-step").style.display = "none";
      document.getElementById("rsvp-form").style.display = "block";

      const guestSelect = document.getElementById("guest-amount");
      const guestLabel = guestSelect.previousElementSibling;

      if (status === "Tidak Hadir") {
        guestSelect.innerHTML = '<option value="0" selected>0</option>';
        guestSelect.style.display = "none";
        guestLabel.style.display = "none";
      } else {
        guestSelect.innerHTML = `
          <option value="" disabled selected>Pilih jumlah</option>
          <option value="1">1</option>
          <option value="2">2</option>`;
        guestSelect.style.display = "block";
        guestLabel.style.display = "block";
      }
    }
  });
}





document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("rsvp-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const form = e.target;
    const data = new FormData(form);

    fetch("https://docs.google.com/forms/d/e/1FAIpQLSfpb6SGSTtJ7RuyJQ1dFrcl8XJ_zci-QMTnm1jt1eBkKTDxug/formResponse", {
      method: "POST",
      mode: "no-cors",
      body: data,
    });

    form.reset();
    document.getElementById("rsvp-form").style.display = "none";
    document.getElementById("rsvp-success").style.display = "block";
  });
});

// ===== CAROUSEL SWIPE SUPPORT =====
let startX = 0;
let endX = 0;
const carouselElement = document.querySelector(".carousel-wrapper");

carouselElement.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

carouselElement.addEventListener("touchend", (e) => {
  endX = e.changedTouches[0].clientX;
  handleSwipe();
});

function handleSwipe() {
  if (startX - endX > 50) {
    currentSlide = (currentSlide + 1) % slides.length;
    updateCarousel();
  } else if (endX - startX > 50) {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateCarousel();
  }
}

// ===== UCAPAN FETCH =====
fetch("https://script.google.com/macros/s/AKfycbwVMaTZ4zEjqFmh9zKsIT6uSRfq2xHxhpG2PcAuIkW_7S_CvSYzIyoz5TkICJuJ4i9_Dw/exec")
  .then(res => res.json())
  .then(data => {
    const list   = document.getElementById("ucapan-list");
    const count  = document.getElementById("guest-count");
    const count1 = document.getElementById("guest-count-no");

    const addEntry = ({ message, name }) => {
      if (!message || !message.trim()) return;
      const p = document.createElement("p");
      p.innerHTML = `<i>"${message}"</i><br><strong>${name}</strong>`;
      list.appendChild(p);
    };
    [...data].reverse().forEach(addEntry);    
    list.style.animationDuration = `${list.scrollHeight / 30}s`;

    const totalGuest = data.reduce((s, r) => s + (+r.bilangan || 0), 0);
    const noGuest    = data.filter(r => r.hadir === "Tidak Hadir").length;

    count.textContent  = totalGuest + 300; 
    count1.textContent = noGuest;
  })
  .catch(err => console.error("Failed to fetch ucapan:", err));

// ===== COUNTDOWN =====
const weddingDate = new Date("2025-08-30T11:00:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = weddingDate - now;

  if (distance < 0) {
    ["days", "hours", "minutes", "seconds"].forEach(id => {
      document.getElementById(id).textContent = "0";
    });
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = hours;
  document.getElementById("minutes").textContent = minutes;
  document.getElementById("seconds").textContent = seconds;
}

updateCountdown();
setInterval(updateCountdown, 1000);


document.addEventListener("DOMContentLoaded", () => {
  const music = document.getElementById("bg-music");
  const btn = document.getElementById("music-btn");
  const icon = document.getElementById("music-icon");
  const introScreen = document.getElementById("intro-screen");
  const enterBtn = document.getElementById("enter-btn");
  const mainContent = document.getElementById("main-content");

  // Show intro screen first
  introScreen.style.display = "flex";
  mainContent.style.display = "none";
  btn.style.display = "none";

  enterBtn.addEventListener("click", () => {
    introScreen.classList.add("fade-out"); // Optional animation class
    enterBtn.classList.add("animate-exit");
    document.body.classList.add("no-scroll");

    setTimeout(() => {
      introScreen.style.display = "none";
      mainContent.style.display = "block";
      btn.style.display = "block";
      document.body.classList.remove("no-scroll");

      // Try to play music
      music.play().then(() => {
        icon.src = "assets/icons/music-sign.png";
        icon.alt = "Music On";
      }).catch(() => {
        icon.src = "assets/icons/mute.png";
        icon.alt = "Music Off";
      });

      // Start auto-scroll
      let autoScroll = true;
      let lastScrollY = 0;

      const scrollInterval = setInterval(() => {
        if (!autoScroll) return;
        window.scrollBy(0, 1);
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
          clearInterval(scrollInterval);
        }
      }, 40);

      window.addEventListener("scroll", () => {
        const currentY = window.scrollY;

        if (currentY < lastScrollY) {
          autoScroll = false;
          clearInterval(scrollInterval);
        }

        if (currentY > lastScrollY) {
          btn.classList.add("hide");
        } else {
          btn.classList.remove("hide");
        }

        lastScrollY = Math.max(0, currentY);
      });
    }, 150); // delay after click
  });

  // Manual toggle
  btn.addEventListener("click", () => {
    if (music.paused) {
      music.play();
      icon.src = "assets/icons/music-sign.png";
      icon.alt = "Music On";
    } else {
      music.pause();
      icon.src = "assets/icons/mute.png";
      icon.alt = "Music Off";
    }
  });
});


btn.addEventListener("click", () => {
  if (music.paused) {
    music.play();
    icon.src = "assets/icons/music-sign.png";
    icon.alt = "Music On";
  } else {
    music.pause();
    icon.src = "assets/icons/mute.png";
    icon.alt = "Music Off";
  }
});

const textarea = document.getElementById('speech');
const wordCountDisplay = document.getElementById('wordCount');

textarea.addEventListener('input', function () {
  let words = this.value.trim().split(/\s+/).filter(Boolean);
  if (words.length > 20) {
    words = words.slice(0, 20);
    this.value = words.join(' ');
  }
  wordCountDisplay.textContent = `Ucapan: (${words.length} / 20 perkataan)`;
});


function openImagePopup(src) {
  document.getElementById("popup-img").src = src;
  document.getElementById("image-popup").style.display = "flex";
}

function closeImagePopup() {
  document.getElementById("image-popup").style.display = "none";
}

function handleRSVPClick() {
  toggleSection('rsvp');
  const buttons = document.querySelectorAll('.rsvp-highlight');
  buttons.forEach(btn => {
    btn.classList.remove('rsvp-highlight');
    btn.style.animation = 'none';
  });
}