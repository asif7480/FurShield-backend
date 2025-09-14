import fs from 'node:fs';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export const uploadFileOnCloudinary = async(localFilePath) => {
    try{
        if(!localFilePath) return null
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        })
        // file has been uploaded successfully
        console.log(`File successfully uploaded on cloudinary`, response.url);
        fs.unlinkSync(localFilePath)
        return response
        
    }catch(err){
        fs.unlinkSync(localFilePath)
        console.log("Cloudinary upload error:", err)
        return null
    }
}
