
export function multiRequest(tasks, limit = 6, cb = () => { }) {
  tasks = [...tasks];
  const queue = [];
  const total = tasks.length;
  let idx = 0;
  let success = 0;
  let failed = 0;
  let resolve;

  const promise = new Promise(r => resolve = r);

  const addTask = () => {
    const task = tasks.shift();
    if (task) {
      const index = idx;
      idx++;
      queue.push(
        task().then(() => {
          success++;
          cb({
            finish: success + failed,
            total,
            success: true,
            index,
          });
        }).catch(err => {
          failed++;
          cb({
            finish: success + failed,
            total,
            success: false,
            index,
            message: err?.message,
          });
        }).finally(() => {
          if (success + failed === total) {
            resolve();
          }
          addTask();
        })
      );
    }
  }

  for (let i = 0; i < limit; i++) {
    addTask();
  }

  return promise;
}
