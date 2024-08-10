import { db, storage } from './firebase-config.js';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js';

export async function uploadXrayDocument(file, patientId, metadata) {
  try {
    // Upload file to Firebase Storage
    const storageRef = ref(storage, `xrays/${patientId}/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // Check if patient document exists
    const patientRef = doc(db, "PatientList", patientId);
    const patientDoc = await getDoc(patientRef);

    if (patientDoc.exists()) {
      // Update existing document
      await updateDoc(patientRef, {
        xrayDocuments: arrayUnion({
          name: file.name,
          url: downloadURL,
          ...metadata
        })
      });
    } else {
      // Create new document
      await setDoc(patientRef, {
        xrayDocuments: [{
          name: file.name,
          url: downloadURL,
          ...metadata
        }]
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

export async function getXrayDocuments(patientId) {
  const patientRef = doc(db, "PatientList", patientId);
  const patientDoc = await getDoc(patientRef);
  
  if (patientDoc.exists()) {
    return patientDoc.data().xrayDocuments || [];
  } else {
    console.log("No such patient!");
    return [];
  }
}