export const verifyGoogleCredential = async (credential) => {
  if (!credential) {
    throw new Error("Google credential is required");
  }

  const response = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`,
  );

  if (!response.ok) {
    throw new Error("Invalid Google credential");
  }

  const profile = await response.json();
  const expectedClientId = process.env.GOOGLE_CLIENT_ID;

  if (expectedClientId && profile.aud !== expectedClientId) {
    throw new Error("Google credential audience mismatch");
  }

  return profile;
};