import { uploadXrayDocument, deleteXrayDocument, getXrayDocuments } from './firebaseStorage.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function initializeXrayModal(patientId) {
  await loadModalHTML();

  const modal = document.getElementById('xrayModal');
  const showBtns = document.querySelectorAll('.show-btn');
  const addDocumentBtn = document.getElementById('addDocumentBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');

  closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  showBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cardTitle = btn.closest('.record-card').querySelector('.card-title').textContent;
      if (cardTitle === 'Appointments') {
        showAppointmentModal(patientId);
      } else {
        document.getElementById('modalTitle').textContent = cardTitle + ' Folder';
        const documentType = cardTitle.toLowerCase(); // Use the card title as the document type
        updateDocumentList(patientId, documentType);
        modal.style.display = 'block';
      }
    });
  });

  addDocumentBtn.addEventListener('click', () => {
    const documentType = document.getElementById('modalTitle').textContent.split(' ')[0].toLowerCase();
    showAddDocumentModal(patientId, documentType);
  });
}

async function loadModalHTML() {
  const response = await fetch('../pages/xrayModal.html');
  const html = await response.text();
  document.body.insertAdjacentHTML('beforeend', html);
}

function showAppointmentModal(patientId) {
  const appointmentModal = document.getElementById('appointmentModal');
  if (!appointmentModal) {
    loadAppointmentModalHTML().then(() => {
      document.getElementById('appointmentModal').style.display = 'block';
      initializeAppointmentModal(patientId);
    });
  } else {
    appointmentModal.style.display = 'block';
    initializeAppointmentModal(patientId);
  }
}

async function loadAppointmentModalHTML() {
  const response = await fetch('../pages/appointmentModal.html');
  const html = await response.text();
  document.body.insertAdjacentHTML('beforeend', html);
}

async function initializeAppointmentModal(patientId) {
  const addAppointmentBtn = document.getElementById('addAppointmentBtn');
  const closeAppointmentModalBtn = document.getElementById('closeAppointmentModalBtn');
  const addAppointmentForm = document.getElementById('addAppointmentForm');
  const cancelAddAppointmentBtn = document.getElementById('cancelAddAppointment');

  addAppointmentBtn.addEventListener('click', showAddAppointmentModal);
  closeAppointmentModalBtn.addEventListener('click', hideAppointmentModal);
  cancelAddAppointmentBtn.addEventListener('click', hideAddAppointmentModal);

  addAppointmentForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(addAppointmentForm);
    const appointmentData = {
      appointmentDateTime: formData.get('appointmentDateTime'),
      department: formData.get('department'),
      doctorName: formData.get('doctorName'),
      reason: formData.get('reason')
    };

    try {
      const docRef = await addDoc(collection(db, `Appointments_${patientId}`), appointmentData);
      console.log("Appointment scheduled with ID: ", docRef.id);
      alert("Appointment scheduled successfully!");
      appendAppointmentToTable(appointmentData);
      hideAddAppointmentModal();
    } catch (error) {
      console.error("Error scheduling appointment: ", error);
      alert("Error scheduling appointment. Please try again.");
    }
  });

  function showAddAppointmentModal() {
    document.getElementById('addAppointmentModal').style.display = 'block';
  }

  function hideAppointmentModal() {
    document.getElementById('appointmentModal').style.display = 'none';
  }

  function hideAddAppointmentModal() {
    document.getElementById('addAppointmentModal').style.display = 'none';
    addAppointmentForm.reset();
  }

  // Load existing appointments
  loadAppointments(patientId);
}

async function loadAppointments(patientId) {
  const appointmentsCollection = collection(db, `Appointments_${patientId}`);
  const querySnapshot = await getDocs(appointmentsCollection);
  querySnapshot.forEach((doc) => {
    appendAppointmentToTable(doc.data());
  });
}

function appendAppointmentToTable(appointmentData) {
  const tableBody = document.querySelector('.patient-list-table tbody');
  const newRow = tableBody.insertRow();

  const fields = ['appointmentDateTime', 'department', 'doctorName', 'reason'];

  fields.forEach(field => {
    const cell = newRow.insertCell();
    if (field === 'appointmentDateTime') {
      const dateTime = new Date(appointmentData[field]);
      const formattedDateTime = `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`;
      cell.textContent = formattedDateTime;
      cell.classList.add('date-time');
    } else {
      cell.textContent = appointmentData[field] || '';
    }
  });
}

async function updateDocumentList(patientId, documentType) {
  const documentList = document.getElementById('documentList');
  documentList.innerHTML = '';

  try {
    const documents = await getXrayDocuments(patientId, documentType);
    if (documents.length === 0) {
      documentList.innerHTML = '<p>No documents found</p>';
    } else {
      const gridList = document.createElement('ul');
      gridList.className = 'grid-list';

      documents.forEach(doc => {
        const listItem = createDocumentListItem(doc, patientId);
        gridList.appendChild(listItem);
      });

      documentList.appendChild(gridList);
    }
  } catch (error) {
    console.error('Error fetching documents:', error);
    documentList.innerHTML = '<p>Error loading documents</p>';
  }
}

function createDocumentListItem(doc, patientId) {
  const listItem = document.createElement('li');
  listItem.className = 'document-item';
  listItem.innerHTML = `
    <div class="document-card">
      <div class="document-image-container">
        <img src="${doc.url}" alt="${doc.name}" class="document-image">
      </div>
      <div class="document-info">
        <h3 class="document-title">${doc.name}</h3>
        <p class="document-text">Practitioner: ${doc.practitionerName}</p>
        <p class="document-text">Date: ${doc.date}</p>
      </div>
      <button class="delete-btn">Delete</button>
    </div>
  `;

  const deleteBtn = listItem.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', () => deleteDocument(patientId, doc.name, doc.url));

  return listItem;
}

async function deleteDocument(patientId, documentName, documentUrl) {
  try {
    await deleteXrayDocument(patientId, documentName, documentUrl);
    updateDocumentList(patientId);
  } catch (error) {
    console.error('Error deleting document:', error);
    alert('Error deleting document. Please try again.');
  }
}

function showAddDocumentModal(patientId, documentType) {
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

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const file = fileInput.files[0];
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const metadata = {
      practitionerName: form.practitionerName.value,
      position: form.position.value,
      date: form.date.value
    };

    try {
      await uploadXrayDocument(file, patientId, metadata, documentType);
      addDocumentModal.style.display = 'none';
      form.reset();
      clearPreviewArea();
      updateDocumentList(patientId, documentType);
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Error uploading document. Please try again.');
    }
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


