import { drive } from "../config/googleDrive.js";

export const extractGoogleDriveId = (url) => {
    if (!url) return null;

    // https://drive.google.com/file/d/FILE_ID/view
    let match = url.match(/\/d\/([^/]+)/);

    if (match) return match[1];

    // https://drive.google.com/uc?export=download&id=FILE_ID
    match = url.match(/[?&]id=([^&]+)/);

    if (match) return match[1];

    return null;
};

export const getGoogleDriveMetadata = async (url) => {
    const fileId = extractGoogleDriveId(url);

    if (!fileId) return null;

    const { data } = await drive.files.get({
        fileId,
        fields: "id,name,size,mimeType",
    });

    return data;
};