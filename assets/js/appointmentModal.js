import { db } from './firebase-config.js';
import { collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', () => {
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
            const patientId = new URLSearchParams(window.location.search).get('idNumber');
            const docRef = await addDoc(collection(db, `Appointments_${patientId}`), appointmentData);
            console.log("Appointment scheduled with ID: ", docRef.id);
            alert("Appointment scheduled successfully!");
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
});