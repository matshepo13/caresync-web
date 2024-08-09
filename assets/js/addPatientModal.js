import { db } from '../js/firebase-config.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

function createAddPatientModal() {
    // Create modal HTML
    const modalHTML = `
      <div id="addPatientModal" class="modal">
        <div class="modal-content">
          <h2>Add A Patient</h2>
          <form id="addPatientForm">
            <input type="text" name="firstName" placeholder="First Name" required>
            <input type="text" name="surname" placeholder="Surname" required>
            <input type="date" name="dateOfBirth" placeholder="Date of Birth" required>
            <select name="gender" required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            </select>
            <input type="tel" name="contactNumber" placeholder="Contact Number" required>
            <input type="text" name="mrn" placeholder="Medical Record Number" required>
            <input type="text" name="idNumber" placeholder="ID Number" required>
            <input type="email" name="email" placeholder="Email" required>
            <textarea name="homeAddress" placeholder="Home Address" required></textarea>
            <textarea name="medicalHistory" placeholder="Medical History" required></textarea>
            <div class="button-group">
                <button type="submit" class="btn has-before">Submit</button>
                <button type="button" class="btn cancel" id="cancelAddPatient">Cancel</button>
            </div>
            </form>
        </div>
      </div>
    `;
  
    // Add modal HTML to the document
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  
    // Add CSS
    const style = document.createElement('style');
    style.textContent = `
      .modal {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.4);
      }
  
      .modal-content {
      background-color: var(--white);
      margin: 5% auto; /* Changed from 10% to 5% to move it higher */
      padding: 20px;
      border-radius: var(--radius-12);
      width: 90%; /* Increased from 80% to 90% */
      max-width: 800px; /* Increased from 500px to 800px */
      box-shadow: var(--shadow-2);
    }
  
      .modal-content h2 {
        color: var(--midnight-green);
        margin-bottom: 20px;
      }
  
      .modal-content form {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
     }
  
      .modal-content input,
      .modal-content select,
      .modal-content textarea {
        padding: 10px;
        border: 1px solid var(--gainsboro);
        border-radius: var(--radius-6);
        font-family: var(--ff-rubik);
      }
  
      .modal-content textarea {
        resize: vertical;
        min-height: 100px;
      }

      modal-content textarea,
    .modal-content .button-group {
      grid-column: 1 / -1;
    }
  
      .button-group {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 20px;
      }
  
      .btn.cancel {
        background-color: var(--ming);
        color: var(--white);
      }
    `;
    document.head.appendChild(style);
  
    const modal = document.getElementById('addPatientModal');
    const cancelBtn = document.getElementById('cancelAddPatient');
    const form = document.getElementById('addPatientForm');

    function showModal() {
      modal.style.display = 'block';
    }

    function hideModal() {
      modal.style.display = 'none';
      form.reset();
    }

    cancelBtn.addEventListener('click', hideModal);

    window.addEventListener('click', function(e) {
      if (e.target == modal) {
        hideModal();
      }
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(form);
        const patientData = {
          idNumber: formData.get('idNumber'),
          firstName: formData.get('firstName'),
          surname: formData.get('surname'),
          dateOfBirth: formData.get('dateOfBirth'),
          gender: formData.get('gender'),
          contactNumber: formData.get('contactNumber'),
          email: formData.get('email'),
          homeAddress: formData.get('homeAddress'),
          mrn: formData.get('mrn'),
          medicalHistory: formData.get('medicalHistory')
        };
      
        try {
          // Add patient data to Firestore
          const docRef = await addDoc(collection(db, "PatientList"), patientData);
          console.log("Document written with ID: ", docRef.id);
          alert("Patient information stored successfully!");
          appendPatientToTable(patientData);
          hideModal();
        } catch (error) {
          console.error("Error adding document: ", error);
          alert("Error storing patient information. Please try again.");
        }
      });

    return showModal;
}

function appendPatientToTable(patientData) {
    const table = document.querySelector('.patient-list-table tbody');
    const newRow = table.insertRow();

    const fields = [
        'idNumber', 'firstName', 'surname', 'dateOfBirth', 'gender',
        'contactNumber', 'email', 'homeAddress', 'mrn', 'medicalHistory'
    ];

    fields.forEach(field => {
        const cell = newRow.insertCell();
        cell.textContent = patientData[field] || '';
    });
}

export default createAddPatientModal;