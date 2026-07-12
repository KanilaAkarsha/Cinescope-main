import { drive } from "../config/googleDrive.js";

export const extractGoogleDriveId = (url) => {
    if (!url) return null;

    const match = url.match(/\/d\/([^/]+)/);

    return match ? match[1] : null;
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