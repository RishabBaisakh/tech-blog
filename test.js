console.log("A");

console.log("B");

setTimeout(() => {
  console.log("Timer");
});

Promise.resolve().then(() => {
  console.log("Promise");
});

console.log("F");
