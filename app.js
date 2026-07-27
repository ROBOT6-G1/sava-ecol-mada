document.addEventListener('DOMContentLoaded', () => {
  // Load Location details dynamically if needed
  fetch('location.json')
    .then(response => response.json())
    .then(loc => {
      console.log('Location config loaded:', loc);
      const locNodes = document.querySelectorAll('.dynamic-location-address');
      locNodes.forEach(node => node.textContent = loc.address);
      const phoneNodes = document.querySelectorAll('.dynamic-location-phone');
      phoneNodes.forEach(node => node.textContent = loc.phone);
      const hoursNodes = document.querySelectorAll('.dynamic-location-hours');
      hoursNodes.forEach(node => node.textContent = loc.hours);
      const notesNodes = document.querySelectorAll('.dynamic-location-notes');
      notesNodes.forEach(node => node.textContent = loc.notes);
    })
    .catch(err => console.log('Using fallback embedded location data.'));

  // Init Google Translate
  window.googleTranslateElementInit = function() {
    if (window.google && window.google.translate) {
      new window.google.translate.TranslateElement({
        pageLanguage: 'mg',
        includedLanguages: 'mg,fr,en,de',
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
      }, 'google_translate_element');
    }
  };

  // FAQ Accordion
  const faqBtns = document.querySelectorAll('.faq-btn');
  faqBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const icon = btn.querySelector('i');
      content.classList.toggle('hidden');
      if(icon) icon.classList.toggle('rotate-180');
    });
  });

  // Quick Registration WhatsApp Direct
  const regForm = document.getElementById('quickRegistrationForm');
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('regName').value.trim();
      const phone = document.getElementById('regPhone').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const course = document.getElementById('regCourse').value;
      const notes = document.getElementById('regNotes').value.trim();

      const registrationData = {
        id: Date.now(),
        name,
        phone,
        email,
        course,
        notes,
        date: new Date().toLocaleString()
      };

      // Save to LocalStorage
      const existing = JSON.parse(localStorage.getItem('excelsior_registrations') || '[]');
      existing.push(registrationData);
      localStorage.setItem('excelsior_registrations', JSON.stringify(existing));

      // Request Push Notification
      if ("Notification" in window && Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            new Notification("ÉCOLE PRIVÉE SAVA - Inscription Vaovao!", {
              body: `${name} dia nisoratra anarana amin'ny ${course}`,
              icon: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=100&q=80'
            });
          }
        });
      }

      // WhatsApp Redirect (Wa.me 261323911654)
      const waMessage = `🎓 INSCRIPTION NOUVELLE - ÉCOLE PRIVÉE SAVA \n----------------------------------\n👤 Client: ${name}\n📞 Tel: ${phone}\n✉️ Email: ${email}\n📚 Course: ${course}\n📝 Fanamarihana: ${notes || 'Tsy misy'}\n📍 Toerana: Antalaha SAVA (Akaiky AVE MARIA)`;
      const encoded = encodeURIComponent(waMessage);
      const waUrl = `https://wa.me/261323911654?text=${encoded}`;

      alert('Misaotra betsaka! Mandefa ny fisoratana anarana amin\'ny WhatsApp izahay izao.');
      window.open(waUrl, '_blank');
      regForm.reset();
    });
  }
});