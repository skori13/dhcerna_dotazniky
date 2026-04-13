export const clinicConfig = {
  name: 'Dentální Hygiena Nikola Černá',
  address: '',           // TODO: adresa
  phone: '',             // TODO: telefon
  email: '',             // TODO: email
  logoPath: '/logo.jpg', // logo v /public
  googleDrive: {
    rootFolderId: import.meta.env.VITE_DRIVE_FOLDER_ID || '',
  },
};
