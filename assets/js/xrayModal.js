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
  const previewArea = document.getElementById('previewArea');

  addDocumentModal.style.display = 'block';

  cancelBtn.addEventListener('click', () => {
    addDocumentModal.style.display = 'none';
    form.reset();
    clearPreviewArea();
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
    handleFiles(e.dataTransfer.files);
  });

  fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your server
    console.log('Form submitted');
    addDocumentModal.style.display = 'none';
    form.reset();
    clearPreviewArea();
    updateDocumentList();
  });
}

function handleFiles(files) {
  const previewArea = document.getElementById('previewArea');
  previewArea.style.display = 'block';
  previewArea.innerHTML = '';

  Array.from(files).forEach((file, index) => {
    const previewItem = createPreviewItem(file, index);
    previewArea.appendChild(previewItem);
    simulateUpload(previewItem.querySelector('.progress'));
  });
}

function createPreviewItem(file, index) {
  const previewItem = document.createElement('div');
  previewItem.className = 'preview-item';
  previewItem.innerHTML = `
    <img src="${getFileIcon(file.type)}" alt="File icon">
    <span class="file-name">${file.name}</span>
    <span class="file-size">${formatFileSize(file.size)}</span>
    <button class="remove-btn" onclick="removeFile(${index})">×</button>
    <div class="progress-bar"><div class="progress"></div></div>
  `;
  previewItem.addEventListener('click', () => displayDocument(file, index));
  return previewItem;
}

function displayDocument(file, index) {
  const previewArea = document.getElementById('previewArea');
  const existingDisplay = document.querySelector('.document-display');
  if (existingDisplay) {
    existingDisplay.remove();
  }

  const displayArea = document.createElement('div');
  displayArea.className = 'document-display';

  if (file.type.startsWith('image/')) {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.alt = file.name;
    displayArea.appendChild(img);
  } else if (file.type === 'application/pdf') {
    const embed = document.createElement('embed');
    embed.src = URL.createObjectURL(file);
    embed.type = 'application/pdf';
    embed.width = '100%';
    embed.height = '500px';
    displayArea.appendChild(embed);
  } else {
    const message = document.createElement('p');
    message.textContent = 'Preview not available for this file type.';
    displayArea.appendChild(message);
  }

  previewArea.appendChild(displayArea);
}

function getFileIcon(fileType) {
  if (fileType.startsWith('image/')) return '../assets/images/image-icon.png';
  if (fileType === 'application/pdf') return '../assets/images/pdf-icon.png';
  return '../assets/images/file-icon.png';
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

function removeFile(index) {
  const previewItems = document.querySelectorAll('.preview-item');
  if (previewItems[index]) {
    previewItems[index].remove();
  }
  if (previewItems.length === 1) {
    document.getElementById('previewArea').style.display = 'none';
  }
}

function simulateUpload(progressBar) {
  let width = 0;
  const interval = setInterval(() => {
    if (width >= 100) {
      clearInterval(interval);
    } else {
      width++;
      progressBar.style.width = width + '%';
    }
  }, 20);
}

function clearPreviewArea() {
  const previewArea = document.getElementById('previewArea');
  previewArea.innerHTML = '';
  previewArea.style.display = 'none';
}

function handleFileSelection(files) {
  const previewArea = document.getElementById('previewArea');
  previewArea.innerHTML = '';

  Array.from(files).forEach(file => {
    const previewItem = document.createElement('div');
    previewItem.className = 'preview-item';

    const icon = document.createElement('img');
    icon.src = getFileIcon(file.type);
    previewItem.appendChild(icon);

    const fileName = document.createElement('span');
    fileName.textContent = file.name;
    previewItem.appendChild(fileName);

    const removeBtn = document.createElement('button');
    removeBtn.textContent = '×';
    removeBtn.onclick = () => previewItem.remove();
    previewItem.appendChild(removeBtn);

    previewArea.appendChild(previewItem);
  });
}

function getFileIcon(fileType) {
  // Return appropriate icon based on file type
  if (fileType.startsWith('image/')) return '../assets/images/image-icon.png';
  if (fileType === 'application/pdf') return '../assets/images/pdf-icon.png';
  return '../assets/images/file-icon.png';
}

document.addEventListener('DOMContentLoaded', initializeXrayModal);