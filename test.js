function ensure(value) {
  if (arguments.length === 0 || value !== "undefined") {
    throw new Error("Please enter valid argument(s).");
  } else {
    console.log(arguments);
  }

  return value;
}

let a;

ensure(a);
