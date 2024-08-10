import { storage, db } from './firebase-config.js';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";
import { doc, updateDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

export async function uploadXrayDocument(file, patientId, metadata) {
  const storageRef = ref(storage, `xrays/${patientId}/${file.name}`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);

  const patientRef = doc(db, "PatientList", patientId);
  await updateDoc(patientRef, {
    xrayDocuments: arrayUnion({
      name: file.name,
      url: downloadURL,
      practitionerName: metadata.practitionerName,
      position: metadata.position,
      date: metadata.date
    })
  });

  return downloadURL;
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
    }
    return [];
  }