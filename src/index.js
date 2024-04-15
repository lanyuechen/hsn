#!/usr/bin/env node

import axios from 'axios';
import ProgressBar from 'progress';
import { multiRequest, sleep } from './utils/utils.js';
import inquirer from './utils/inquirer.js';
import storage from './utils/storage.js';
import data from './api.data.js';

axios.defaults.timeout = 5000;

const parseRequestData = (str, mobile) => {
  return str.replace(/\[phone\]/g, mobile).replace(/\[timestamp\]/g, Date.now())
}

const run = async () => {
  console.log('开始');
  const mobile = await inquirer.input('请输入手机号');

  const tasks = data.map((d) => async () => {
    if (typeof d === 'string') {
      const url = parseRequestData(d, mobile);
      return axios.get(url);
    }
    const config = JSON.parse(parseRequestData(JSON.stringify(d), mobile))
    return axios(config);
  });

  const bar = new ProgressBar('[:bar] :current/:total :elapseds', {
    total: data.length,
    width: 20,
  });

  let count = 0;

  while(true) {
    count += 1;
    bar.update(0);

    let result = {
      total: data.length,
      success: 0,
      fail: 0,
    };

    await multiRequest(tasks, 6, ({ success, message }) => {
      result[success ? 'success' : 'fail'] += 1; 
  
      bar.tick();
      // logger.log(`${url.substring(0, 32)}...`)
      // console.log(
      //   `[${`000${count}`.slice(-4)}]`,
      //   `${url.substring(0, 32)}...`,
      //   success ? '[success]' : '[fail]',
      //   message || '',
      // );
    });

    console.log(`第${count}轮，total: ${result.total}，success: ${result.success}`);

    await sleep(5000);
  }
}

run();
