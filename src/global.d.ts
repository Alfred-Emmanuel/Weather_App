declare namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_BASE_URL: string;
      // Add other environment variables here
    }
    interface LocationData {
        location: {
          name: string;
        };
        // Add other properties if needed
    }
  }
  
  declare var process: {
    env: NodeJS.ProcessEnv;
  };
  