const DRIVE_API = 'https://www.googleapis.com/drive/v3';
const UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3';

export async function findOrCreateFolder(
  folderName: string,
  parentFolderId: string,
  accessToken: string,
): Promise<string> {
  // Search for existing folder by name within parent
  const escapedName = folderName.replace(/'/g, "\\'");
  const query = `name='${escapedName}' and '${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`;
  const searchRes = await fetch(
    `${DRIVE_API}/files?q=${encodeURIComponent(query)}&fields=files(id,name)&supportsAllDrives=true&includeItemsFromAllDrives=true`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  if (!searchRes.ok) {
    const errText = await searchRes.text();
    throw new Error(`Folder search failed: ${searchRes.status} ${errText}`);
  }
  const searchData = await searchRes.json();

  if (searchData.files && searchData.files.length > 0) {
    return searchData.files[0].id;
  }

  // Create new folder inside parent
  const createRes = await fetch(`${DRIVE_API}/files?supportsAllDrives=true`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentFolderId],
    }),
  });
  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Folder create failed: ${createRes.status} ${errText}`);
  }
  const createData = await createRes.json();
  if (!createData.id) {
    throw new Error('Folder creation did not return an ID');
  }
  return createData.id;
}

export async function uploadPdfToDrive(
  pdfBlob: Blob,
  fileName: string,
  folderId: string,
  accessToken: string,
): Promise<{ id: string; webViewLink: string }> {
  const metadata = {
    name: fileName,
    mimeType: 'application/pdf',
    parents: [folderId],
  };

  const form = new FormData();
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' }),
  );
  form.append('file', pdfBlob);

  const res = await fetch(
    `${UPLOAD_API}/files?uploadType=multipart&fields=id,webViewLink,parents&supportsAllDrives=true`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: form,
    },
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Drive upload failed: ${res.status} ${errText}`);
  }

  const data = await res.json();
  if (!data.id) {
    throw new Error('Upload did not return file ID');
  }
  return data;
}
