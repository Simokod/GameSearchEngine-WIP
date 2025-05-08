export const STORE_NAMES = {
  STEAM: "steam",
  GOG: "gog",
  APP_STORE: "app_store",
  GOOGLE_PLAY: "google_play",
};

export type StoreName = (typeof STORE_NAMES)[keyof typeof STORE_NAMES];
