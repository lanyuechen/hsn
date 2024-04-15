#!/usr/bin/env node

import axios from 'axios';
import ProgressBar from 'progress';
import { multiRequest } from './utils/utils.js';
import inquirer from './utils/inquirer.js';
import Logger from './utils/logger.js';
import data from './api.json' assert { type: "json" };

axios.defaults.timeout = 5000;

const writeLog = (bar, logs, tailLine) => {
  for (let i = 0; i < logs.length; i++) {
    for (let j = i; j < logs.length; j++) {
      console.log('\r');
    }
    console.log(logs[i]);
  }
  bar.tick();
}

const run = async () => {
  console.log('开始');
  const mobile = await inquirer.input('请输入手机号');

  const tasks = data.map((url) => async () => {
    url = url.replace(/\[phone\]/g, mobile);
    return axios.get(url);
  });

  const bar = new ProgressBar('[:bar] :current/:total :elapseds', {
    total: data.length,
    width: 20,
  });

  let latestLogs = [];

  // const logger = new Logger(bar, 6);

  await multiRequest(tasks, 6, ({ finish, total, index, success, message }) => {
    const url = data[index];
    latestLogs = [...latestLogs, { url, finish, total, index, success, message }].slice(-6);

    // bar.tick()
    // logger.log(`${url.substring(0, 32)}...`)
    console.log(
      `${url.substring(0, 32)}...`,
      success ? '[success]' : '[fail]',
      message || '',
    );
  });
}

run();
