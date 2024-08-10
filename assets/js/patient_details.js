
console.log('patient-details.js loaded');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM content loaded');
  
  const urlParams = new URLSearchParams(window.location.search);
  console.log('URL params:', urlParams.toString());

  const patientName = urlParams.get('firstName') + ' ' + urlParams.get('surname');
  const medicalHistory = urlParams.get('medicalHistory');

  console.log('Patient name:', patientName);
  console.log('Medical history:', medicalHistory);

  // Update patient name
  const nameElement = document.querySelector('.summary-content h2');
  if (nameElement) {
    nameElement.textContent = patientName;
  } else {
    console.error('Name element not found');
  }

  // Update medical history
  const historyElement = document.querySelector('.summary-content p');
  if (historyElement) {
    historyElement.textContent = medicalHistory || 'No medical history available';
  } else {
    console.error('History element not found');
  }

  // Update other patient details as needed
  updateElement('patientAge', calculateAge(urlParams.get('dateOfBirth')));
  updateElement('patientGender', urlParams.get('gender'));
  updateElement('patientContact', urlParams.get('contactNumber'));
  updateElement('patientEmail', urlParams.get('email'));
  updateElement('patientAddress', urlParams.get('homeAddress'));
  updateElement('patientIdNumber', urlParams.get('idNumber'));
  updateElement('patientMRN', urlParams.get('mrn'));
});

function updateElement(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  } else {
    console.error(`Element with id '${id}' not found`);
  }
}

function calculateAge(birthDate) {
  if (!birthDate) return 'N/A';
  const today = new Date();
  const birthDateObj = new Date(birthDate);
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }
  return age;
}