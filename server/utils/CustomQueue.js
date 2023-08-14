class CustomQueue {
  constructor(concurrency) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }

  add(task) {
    return new Promise((resolve, reject) => {
      const taskWithCallback = async () => {
        try {
          await task();
          resolve();
        } catch (error) {
          reject(error);
        } finally {
          this.running--;
          this.runNextTask();
        }
      };

      this.queue.push(taskWithCallback);
      this.runNextTask();
    });
  }

  runNextTask() {
    if (this.running < this.concurrency && this.queue.length > 0) {
      const task = this.queue.shift();
      this.running++;
      task();
    }
  }
}

module.exports = CustomQueue;