async function loadModalHTML() {
    const response = await fetch('../pages/xrayModal.html');
    const html = await response.text();
    document.body.insertAdjacentHTML('beforeend', html);
  }
  
  async function initializeXrayModal() {
    await loadModalHTML();
  
    const modal = document.getElementById('xrayModal');
    const showBtns = document.querySelectorAll('.show-btn');
    const addDocumentBtn = document.getElementById('addDocumentBtn');
  
    showBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cardTitle = btn.closest('.record-card').querySelector('.card-title').textContent;
        document.getElementById('modalTitle').textContent = cardTitle + ' Folder';
        updateDocumentList();
        modal.style.display = 'block';
      });
    });
  
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  
    addDocumentBtn.addEventListener('click', showAddDocumentModal);
  }
  
  function updateDocumentList() {
    const documentList = document.getElementById('documentList');
    // Here you would typically fetch the documents from your database
    // For now, we'll just show a placeholder message
    documentList.innerHTML = '<p>No documents found</p>';
  }
  
  function showAddDocumentModal() {
    const addDocumentModal = document.getElementById('addDocumentModal');
    const cancelBtn = document.getElementById('cancelAddDocument');
    const form = document.getElementById('addDocumentForm');
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
  
    addDocumentModal.style.display = 'block';
  
    cancelBtn.addEventListener('click', () => {
      addDocumentModal.style.display = 'none';
      form.reset();
    });
  
    dropZone.addEventListener('click', () => fileInput.click());
  
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });
  
    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('dragover');
    });
  
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      fileInput.files = e.dataTransfer.files;
    });
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Here you would typically send the form data to your server
      console.log('Form submitted');
      addDocumentModal.style.display = 'none';
      form.reset();
      updateDocumentList();
    });
  }
  
  document.addEventListener('DOMContentLoaded', initializeXrayModal);