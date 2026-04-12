export const clinicConfig = {
  name: '',              // TODO: název ordinace
  address: '',           // TODO: adresa
  phone: '',             // TODO: telefon
  email: '',             // TODO: email
  logoPath: '/logo.jpg', // logo v /public
  googleDrive: {
    rootFolderId: import.meta.env.VITE_DRIVE_FOLDER_ID || '',
  },
};
