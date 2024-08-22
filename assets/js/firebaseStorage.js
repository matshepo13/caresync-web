import { db, storage } from './firebase-config.js';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js';

export async function uploadXrayDocument(file, patientId, metadata, documentType) {
  try {
    // Upload file to Firebase Storage
    const storageRef = ref(storage, `${documentType}/${patientId}/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // Check if patient document exists
    const patientRef = doc(db, "PatientList", patientId);
    const patientDoc = await getDoc(patientRef);

    const newDocument = {
      name: file.name,
      url: downloadURL,
      type: documentType,
      ...metadata
    };

    if (patientDoc.exists()) {
      // Update existing document
      await updateDoc(patientRef, {
        [`${documentType}Documents`]: arrayUnion(newDocument)
      });
    } else {
      // Create new document
      await setDoc(patientRef, {
        [`${documentType}Documents`]: [newDocument]
      });
    }

    console.log("Document successfully uploaded and stored");
  } catch (error) {
    console.error("Error uploading document: ", error);
    throw error;
  }
}

export async function deleteXrayDocument(patientId, documentName, documentUrl) {
  const storageRef = ref(storage, `xrays/${patientId}/${documentName}`);
  await deleteObject(storageRef);

  const patientRef = doc(db, "PatientList", patientId);
  await updateDoc(patientRef, {
    xrayDocuments: arrayRemove({
      name: documentName,
      url: documentUrl
    })
  });
}

export async function getXrayDocuments(patientId, documentType) {
  const patientRef = doc(db, "PatientList", patientId);
  const patientDoc = await getDoc(patientRef);
  
  if (patientDoc.exists()) {
    return patientDoc.data()[`${documentType}Documents`] || [];
  } else {
    console.log("No such patient!");
    return [];
  }
}

export async function addAppointment(patientId, appointmentData) {
  try {
    const docRef = await addDoc(collection(db, `Appointments_${patientId}`), appointmentData);
    console.log("Appointment scheduled with ID: ", docRef.id);
    alert("Appointment scheduled successfully!");
  } catch (error) {
    console.error("Error scheduling appointment: ", error);
    alert("Error scheduling appointment. Please try again.");
  }
}