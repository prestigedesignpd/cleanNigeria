export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL as string,
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID as string,
  paystackPublicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string,
  socketUrl: import.meta.env.VITE_SOCKET_URL as string,
  appName: (import.meta.env.VITE_APP_NAME as string) || 'CleanNigeria',
  appUrl: (import.meta.env.VITE_APP_URL as string) || 'https://cleannigeria.com',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
}
