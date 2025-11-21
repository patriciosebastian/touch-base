const getApiConfig = () => {
  const env = process.env.REACT_APP_APP_ENV || 'production';

  const configs = {
    local: {
      baseURL: `http://${process.env.REACT_APP_LOCAL_BACKEND_URL}`,
      protocol: 'http',
      host: process.env.REACT_APP_LOCAL_BACKEND_URL
    },
    production: {
      baseURL: `https://${process.env.REACT_APP_BACKEND_URL}`,
      protocol: 'https',
      host: process.env.REACT_APP_BACKEND_URL
    }
  };

  return configs[env] || configs.production;
};

export const API_CONFIG = getApiConfig();
export const API_BASE_URL = API_CONFIG.baseURL;
