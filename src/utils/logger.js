const Logger = class {
  constructor(bar, tail = 5) {
    this.bar = bar;
    this.tail = tail;
    this.logs = new Array(tail).fill('');
  }

  log(log) {
    process.stdout.write('\x1bc'); // 清空日志

    this.logs = [...this.logs, log].slice(-this.tail);

    for (let i = 0; i < this.tail; i++) {
      console.log(this.logs[i]);
    }
    this.bar.tick();
  }
}

export default Logger