const DB_NAME = 'dental-forms-backup';
const STORE_NAME = 'submissions';
const DB_VERSION = 1;

export interface Submission {
  id: string;
  patientName: string;
  formType: string;
  formLanguage: 'cs' | 'en';
  submittedAt: string;
  pdfBlob: Blob;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('submittedAt', 'submittedAt', { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveSubmission(submission: Submission): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(submission);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllSubmissions(): Promise<Omit<Submission, 'pdfBlob'>[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => {
      const results = (req.result as Submission[])
        .map(({ id, patientName, formType, formLanguage, submittedAt }) => ({
          id,
          patientName,
          formType,
          formLanguage,
          submittedAt,
        }))
        .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
      resolve(results);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function getSubmissionPdf(id: string): Promise<Blob | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(id);
    req.onsuccess = () => {
      const result = req.result as Submission | undefined;
      resolve(result?.pdfBlob ?? null);
    };
    req.onerror = () => reject(req.error);
  });
}
