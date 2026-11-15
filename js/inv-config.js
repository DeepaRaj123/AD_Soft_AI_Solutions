/* =========================================================
   INVITATION PLATFORM — CONFIG  (fill these in once)
   ========================================================= */
window.INV_CONFIG = {
  // Firebase web-app config (Project settings → Your apps → Web app)
  firebase: {
                    apiKey: "AIzaSyCiSDYQukrsFtL2-loQj2v3BX0b8yXFo2c",
                    authDomain: "adsoft-b88db.firebaseapp.com",
                    databaseURL: "https://adsoft-b88db-default-rtdb.firebaseio.com",
                    projectId: "adsoft-b88db",
                    storageBucket: "adsoft-b88db.appspot.com",
                    messagingSenderId: "870985803057",
                    appId: "1:870985803057:web:7d5a341f4205be7c17bc10"
  },

  // Cloudinary — create an UNSIGNED upload preset (Settings → Upload → Upload presets)
  cloudinary: {
    cloudName: 'YOUR_CLOUD_NAME',
    uploadPreset: 'YOUR_UNSIGNED_PRESET',
    folder: 'invitations',
  },

  // Firestore collection used by this platform (kept separate from your existing data)
  collection: 'premiumInvitations',

  // Add a folder name here every time you build a new template in /templates/<id>/
  templates: ['royal-ivory', 'olivas', 'violet-butterfly'],

  // Public page that renders a saved invitation (relative to site root)
  viewerUrl: 'invitation.html',

  // Optional: site root if the pages are not served from the site root
  // siteRoot: '/',

  maxImageMB: 10,
  maxAudioMB: 12,
};
