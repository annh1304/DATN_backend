const firebaseAdmin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
const serviceAccount = require('../yummyfood-image-storage-firebase-adminsdk-hhv84-d5c54b11f0.json');


const admin = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
});


const storageRef = admin.storage().bucket(`gs://yummyfood-image-storage.appspot.com`);


async function uploadFile(path, filename) {

    // Upload the File
    const storage = await storageRef.upload(path, {
        public: true,
        destination: `image/food/${filename}`,
        metadata: {
            firebaseStorageDownloadTokens: uuidv4(),
        }
    });


    return storage[0].metadata.mediaLink;
}

module.exports = { uploadFile };

// (async () => {
//     await uploadFile('./mypic.png', "my-image.png");

// })();
