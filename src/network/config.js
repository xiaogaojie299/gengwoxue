// const devBaseURL = "http://192.168.0.80/teacher";
const devBaseURL = "http://139.9.154.145:81/";
const proBaseURL = "http://139.9.154.145:81/";
export const BASE_URL = process.env.NODE_ENV === 'development' ? devBaseURL: proBaseURL;
export const TIMEOUT = 5000;
