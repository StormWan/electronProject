export const motion = {
  directives: {
    "bottom-0": {
      initial: {
        scale: 0,
        opacity: 0,
        y: 100,
      },
      visible: {
        scale: 1,
        opacity: 1,
        y: 0,
      },
    },
    "bottom-1": {
      initial: { opacity: 0, y: 100 },
      enter: {
        opacity: 1,
        y: 0,
        transition: {
          delay: 100,
        },
      },
    },
  },
};
