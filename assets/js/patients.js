import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getFirestore, collection, getDocs, addDoc } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';
import createAddPatientModal from './addPatientModal.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
  const addPatientBtn = document.querySelector('#addPatientBtn');
  const showModal = createAddPatientModal(db, addDoc, collection);

  addPatientBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showModal();
  });

  loadPatients();
});

async function loadPatients() {
  const patientsCollection = collection(db, "PatientList");
  const querySnapshot = await getDocs(patientsCollection);
  querySnapshot.forEach((doc) => {
    appendPatientToTable(doc.data());
  });
}



function appendPatientToTable(patientData) {
    const table = document.querySelector('.patient-list-table tbody');
    const newRow = table.insertRow();
    
    const fields = [
      'idNumber', 'firstName', 'surname', 'dateOfBirth', 'gender',
      'contactNumber', 'email', 'homeAddress', 'mrn', 'medicalHistory'
    ];
  
    fields.forEach((field, index) => {
      const cell = newRow.insertCell();
      if (index === 1 || index === 2) { // firstName and surname
        const nameButton = document.createElement('button');
        nameButton.textContent = patientData[field] || '';
        nameButton.classList.add('patient-name-btn');
        nameButton.addEventListener('click', () => {
          loadPatientDetails(patientData);
        });
        cell.appendChild(nameButton);
      } else {
        cell.textContent = patientData[field] || '';
      }
    });
  }
  
  function loadPatientDetails(patientData) {
    const params = new URLSearchParams(patientData);
    window.location.href = `patient_details.html?${params.toString()}`;
  }
  
  // Make sure loadPatientDetails is available globally
  window.loadPatientDetails = loadPatientDetails;