document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('adminLoginForm');
  const loginModal = document.getElementById('loginModal');
  const adminDashboard = document.getElementById('adminDashboard');
  const logoutBtn = document.getElementById('logoutBtn');

  // Auth Check
  if (sessionStorage.getItem('excelsior_admin_logged') === 'true') {
    loginModal.classList.add('hidden');
    adminDashboard.classList.remove('hidden');
    loadRegistrations();
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const pass = document.getElementById('adminPassword').value;
    if (pass === '1234') {
      sessionStorage.setItem('excelsior_admin_logged', 'true');
      loginModal.classList.add('hidden');
      adminDashboard.classList.remove('hidden');
      loadRegistrations();
    } else {
      alert('Mot de passe diso! (Manandrama 1234)');
    }
  });

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('excelsior_admin_logged');
      location.reload();
    });
  }

  // Canvas Image Compressor
  const imageUploader = document.getElementById('imageUploader');
  if (imageUploader) {
    imageUploader.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const maxWidth = 800;
          const scale = maxWidth / img.width;
          canvas.width = maxWidth;
          canvas.height = img.height * scale;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const base64 = canvas.toDataURL('image/jpeg', 0.7);
          
          document.getElementById('compressedPreview').src = base64;
          document.getElementById('base64Output').value = base64;
          document.getElementById('previewContainer').classList.remove('hidden');
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  }
});

function loadRegistrations() {
  const listContainer = document.getElementById('registrationsList');
  const badge = document.getElementById('regCountBadge');
  const registrations = JSON.parse(localStorage.getItem('excelsior_registrations') || '[]');

  if (badge) badge.textContent = registrations.length;
  if (!listContainer) return;

  if (registrations.length === 0) {
    listContainer.innerHTML = `<p class="text-slate-500 text-xs italic">Tsy misy inscription vaovao aloha.</p>`;
    return;
  }

  listContainer.innerHTML = registrations.map((item, idx) => `
    <div class="p-4 rounded-xl bg-slate-800 border border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <div class="flex items-center gap-2">
          <h4 class="font-bold text-white text-sm">${item.name}</h4>
          <span class="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">${item.course}</span>
        </div>
        <p class="text-xs text-slate-400 mt-1"><i class="fa-solid fa-phone mr-1"></i> ${item.phone} | <i class="fa-solid fa-envelope mr-1"></i> ${item.email}</p>
        ${item.notes ? `<p class="text-xs text-slate-300 italic mt-1 bg-slate-900/50 p-2 rounded">"${item.notes}"</p>` : ''}
        <span class="text-[10px] text-slate-500 mt-1 block">${item.date}</span>
      </div>
      <div class="flex items-center gap-2">
        <a href="https://wa.me/${item.phone.replace(/[^0-9]/g, '')}?text=Salama%20${encodeURIComponent(item.name)},%20momba%20ny%20inscription%20${encodeURIComponent(item.course)}" target="_blank" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1">
          <i class="fa-brands fa-whatsapp"></i> WhatsApp
        </a>
        <button onclick="deleteReg(${idx})" class="px-3 py-1.5 rounded-lg bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white font-bold text-xs transition">
          Fafana
        </button>
      </div>
    </div>
  `).join('');
}

function deleteReg(index) {
  if (confirm('Azo antoka ve fa hofafana ity inscription ity?')) {
    const registrations = JSON.parse(localStorage.getItem('excelsior_registrations') || '[]');
    registrations.splice(index, 1);
    localStorage.setItem('excelsior_registrations', JSON.stringify(registrations));
    loadRegistrations();
  }
}

function switchTab(tab) {
  if (tab === 'registrations') {
    document.getElementById('tab-registrations').classList.remove('hidden');
    document.getElementById('tab-images').classList.add('hidden');
  } else {
    document.getElementById('tab-registrations').classList.add('hidden');
    document.getElementById('tab-images').classList.remove('hidden');
  }
}