export const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    const protocol = window.location.protocol || "http:";
    return `${protocol}//${host}:3000/api/v1/`;
  }
  return "http://localhost:3000/api/v1/";
};

export const getGameScenarioUrl = () => `${getApiBaseUrl()}game/scenario`;
export const getChatStreamUrl = () => `${getApiBaseUrl()}chat/stream`;
export const getChatTtsUrl = () => `${getApiBaseUrl()}chat/tts`;
export const getTurnstilePassUrl = () => `${getApiBaseUrl()}chat/turnstile-pass`;
export const getAuthLoginUrl = () => `${getApiBaseUrl()}auth/login`;
export const getPrayerTimesUrl = () => `${getApiBaseUrl()}chat/prayer-times`;
export const getAdminMessageLogsUrl = () => `${getApiBaseUrl()}chat/admin/message-logs`;
export const getTafsirUrl = () => `${getApiBaseUrl()}chat/tafsir`;
export const getGameHealthUrl = () => `${getApiBaseUrl()}game/health`;

export const API_BASE_URL = getApiBaseUrl();
export const CHAT_STREAM_URL = `${API_BASE_URL}chat/stream`;
export const CHAT_TTS_URL = `${API_BASE_URL}chat/tts`;
export const TURNSTILE_PASS_URL = `${API_BASE_URL}chat/turnstile-pass`;
export const AUTH_LOGIN_URL = `${API_BASE_URL}auth/login`;
export const PRAYER_TIMES_URL = `${API_BASE_URL}chat/prayer-times`;
export const ADMIN_MESSAGE_LOGS_URL = `${API_BASE_URL}chat/admin/message-logs`;
export const TAFSIR_URL = `${API_BASE_URL}chat/tafsir`;
export const GAME_SCENARIO_URL = `${API_BASE_URL}game/scenario`;
export const GAME_HEALTH_URL = `${API_BASE_URL}game/health`;
export const GA_MEASUREMENT_ID = "G-NJTTFJJEWM";
export const USER_ID = null;
