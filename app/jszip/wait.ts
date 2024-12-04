let time: any;

function wait(cb: () => void) {
  if (time) clearTimeout(time);

  time = setTimeout(() => {
    cb();
    clearTimeout(time);
  }, 1000);
}

export { wait };
