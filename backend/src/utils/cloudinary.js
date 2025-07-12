const v2 = require('cloudinary').v2;

const cloudnairyconnect = () => {
    try {
      v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      console.log("CD connected");
    } catch (error) {
      console.log("error connecting CD" + error);
    }
  };

// Direct upload from buffer
const uploadOnCloudinary = async (fileBuffer, fileName) => {
    try{
        await cloudnairyconnect();
        if(!fileBuffer){
            throw new Error('File buffer is required');
        }
        
        return new Promise((resolve, reject) => {
            v2.uploader.upload_stream({
                resource_type: 'auto',
                public_id: fileName ? fileName.split('.')[0] : undefined // Remove extension for public_id
            }, (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return reject(error);
                }
                console.log('File uploaded to Cloudinary:', result.secure_url);
                resolve(result);
            }).end(fileBuffer);
        });
    } catch (error){
        console.error('Error uploading file on cloudinary:',error);
        return null;
    }
}

module.exports = { uploadOnCloudinary };