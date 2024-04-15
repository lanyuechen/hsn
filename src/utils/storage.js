import fs from 'fs';

const CONFIG_PATH = './config.json';

const getItem = (key) => {
  try {
    const str = fs.readFileSync(CONFIG_PATH, { encoding: 'utf-8' });
    const config = JSON.parse(str);
    return config[key];
  } catch(err) {
    return;
  }
}

const setItem = (key, value) => {
  let config;

  try {
    const str = fs.readFileSync(CONFIG_PATH, { encoding: 'utf-8' });
    config = JSON.parse(str || '{}');
    config[key] = value;
  } catch(err) {
    config = { [key]: value };
  }

  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, undefined, 2));
}

export default { getItem, setItem };