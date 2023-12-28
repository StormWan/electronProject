export function checkTextNotEmpty(arr) {
  return arr.some((obj) => {
    return obj.children.some((child) => {
      return child.text !== "";
    });
  });
}

export function transformData(data) {
  const inputData = data.filter(
    (item) => !item.isTimeDivider && !item.isDeleted && !item.isRevoked
  );
  return inputData
    .map((data) => {
      return {
        role: data.flow === "in" ? "assistant" : "user",
        content: data.payload.text,
      };
    })
    .reverse();
}
