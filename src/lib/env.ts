export interface PublicEnvConfig {
  readonly APP_URL: string;
  readonly LANDING_URL: string;
}

export const PUBLIC_ENV: PublicEnvConfig = {
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || "https://app.schedovyn.com",
  LANDING_URL: process.env.NEXT_PUBLIC_LANDING_URL || "https://schedovyn.com",
};
