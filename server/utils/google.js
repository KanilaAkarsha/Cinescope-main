import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function verifyGoogleCredential(credential) {
  if (!credential) {
    throw new Error("Google credential is required");
  }

  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  return ticket.getPayload();
}
