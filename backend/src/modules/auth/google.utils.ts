import { OAuth2Client } from "google-auth-library";

import config from "../../config";
import AppError from "../../error/AppError";

const googleClient = new OAuth2Client(config.googleClientId);

export interface GoogleUserPayload {
  googleId: string;
  email: string;
  name: string;
  avatar: string;
  emailVerified: boolean;
}

export const verifyGoogleIdToken = async (
  idToken: string,
): Promise<GoogleUserPayload> => {
  if (!idToken) {
    throw new AppError(401, "Google ID token is required");
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: config.googleClientId,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new AppError(401, "Invalid Google token");
    }

    if (!payload.sub) {
      throw new AppError(401, "Google account ID is missing");
    }

    if (!payload.email) {
      throw new AppError(401, "Google email is missing");
    }

    return {
      googleId: payload.sub,

      email: payload.email.toLowerCase(),

      name: payload.name || payload.email.split("@")[0],

      avatar: payload.picture || "",

      emailVerified: payload.email_verified === true,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(401, "Invalid or expired Google token");
  }
};
