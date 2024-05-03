const original = window.setInterval;

window.setInterval = function (fn, time) {
  function wrapper(...args) {
    const res = fn.apply(this, args);

    if (!res) {
      clearInterval(interval);
      setYouDidIt();
    }

    return res;
  }
  const interval = original(wrapper, time);
  return interval;
};

const setYouDidIt = () => {
  const span = document.querySelector(".countDown__text");
  span.innerHTML = "You did it";
  span.classList.add("countDown__text_ok");
};
