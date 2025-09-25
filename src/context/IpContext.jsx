import { createContext, useContext, useState, useEffect } from 'react';

// Create the IpContext
const IpContext = createContext();

// Export the IpProvider
export function IpProvider({ children }) {
  const [ip, setIp] = useState(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    let currentIp = url.searchParams.get("ip");

    if (!currentIp) {
      currentIp = "54.208.79.216"; // Your EC2 public IP
      url.searchParams.set("ip", currentIp);
      window.history.replaceState({}, "", url);
    }

    setIp(currentIp);

    const handlePopState = () => {
      const newUrl = new URL(window.location.href);
      setIp(newUrl.searchParams.get("ip"));
    };
    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const updateIp = (newIp) => {
    const url = new URL(window.location.href);
    url.searchParams.set("ip", newIp);
    window.history.pushState({}, "", url);
    setIp(newIp);
  };

  // Enhanced function to fetch data from your EC2 backend with support for POST and other methods
  const callBackend = async (endpoint = "/", options = {}) => {
    if (!ip) return null;
    const { method = 'GET', body = null, headers = {} } = options;
    try {
      const config = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      };
      if (body && method !== 'GET') {
        config.body = JSON.stringify(body);
      }
      const response = await fetch(`http://${ip}:3000${endpoint}`, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error connecting to EC2:", err);
      return null;
    }
  };

  return (
    <IpContext.Provider value={{ ip, updateIp, callBackend }}>
      {children}
    </IpContext.Provider>
  );
}

// Export the useIp hook
export const useIp = () => {
  const context = useContext(IpContext);
  if (!context) {
    throw new Error('useIp must be used within an IpProvider');
  }
  return context;
};