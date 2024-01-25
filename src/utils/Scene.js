import { nextTick } from "vue";

function convertToArray(val) {
  return Array.isArray(val) ? val : [val];
}

export function chartSetTimeout(chart, cb, time) {
  const animator = chart
    .getZr()
    .animation.animate(
      { val: 0 },
      {
        loop: false,
      }
    )
    .when(time, {
      val: 1,
    })
    .during(() => {
      // Please don't fall sleep.
      // TODO Can be configurable.
      chart.getZr().wakeUp();
    })
    .done(() => {
      // NOTE: Must delay the callback. Or zrender flush will invoke the chartSetTimeout callback again.
      // TODO: This is something needs to be fixed in zrender.
      nextTick(cb);
    })
    .start();

  return animator;
}

export function chartClearTimeout(chart, animator) {
  if (!animator) {
    return;
  }
  chart.getZr().animation.removeAnimator(animator);
}

class Scene {
  constructor(opts) {
    this._options = convertToArray(opts.option);
    this._durations = convertToArray(opts.duration);
    this._title = opts.title || "";
    this._titleStyle = opts.titleStyle || "";
    this._background = opts.background || "";
    this._dark = opts.dark || false;
    this._file = opts.file || "pieEntry";
  }

  getDuration() {
    let sum = 0;
    this._options.forEach((opt, idx) => {
      const duration = this._durations[idx] || this._durations[this._durations.length - 1];
      sum += duration;
    });
    return sum;
  }

  getFile() {
    return this._file;
  }

  getTitle() {
    return this._title;
  }

  getTitleStyle() {
    return this._titleStyle;
  }

  getBackground() {
    return this._background;
  }

  isDark() {
    return this._dark;
  }

  reset() {
    // Reset
    this._currentIndex = 0;
  }

  play(chart, apiOpts, onfinish) {
    if (this._timeout) {
      chartClearTimeout(chart, this._timeout);
    }
    this._playCurrent(chart, apiOpts, onfinish);
  }

  stop(chart) {
    chartClearTimeout(chart, this._timeout);
  }

  _playCurrent(chart, apiOpts, onfinish) {
    if (this._currentIndex >= this._options.length) {
      onfinish();
      return;
    }
    const notMerge = this._currentIndex === 0;
    const option = this._options[this._currentIndex];
    if (typeof option === "function") {
      const ret = option(chart, apiOpts);
      if (ret) {
        chart.setOption(ret, notMerge);
      }
    } else {
      chart.setOption(option, notMerge);
    }

    const duration =
      this._durations[this._currentIndex] || this._durations[this._durations.length - 1];
    // Play next scene.
    this._timeout = chartSetTimeout(
      chart,
      () => {
        this._playCurrent(chart, apiOpts, onfinish);
      },
      duration
    );

    this._currentIndex++;
  }
}

export default Scene;
