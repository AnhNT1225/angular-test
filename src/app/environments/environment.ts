const currentHost = window?.location?.host;
const currentProtocol = window?.location?.protocol || 'http:';
// const baseURL = `${currentProtocol}//${currentHost.replace("8000", "8080")}`;
const baseURL = `${currentProtocol}//${currentHost.replace('3000', '8000')}`;

// const baseURL = 'http://localhost:8000';
export const environment = {
  production: false,
  API_URL: baseURL,
  debugMode: true,
};
