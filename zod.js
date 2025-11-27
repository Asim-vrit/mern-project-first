const z = require("zod");

const schema = z.object({
  name: z.string(),
  title: z.string(),
  desc: z.string().nullable(),
  price: z.number(),
});

let a = { title: "asdjhda", desc: null, price: "123" };

try {
  schema.parse(a);
  console.log("success");
} catch (error) {
  const prettyError = z.flattenError(error);
  console.log("error", prettyError.fieldErrors);
}

// curry function

const curry = (a) => {
  return (b) => {
    return (c) => {
      console.log(a, b, c);
    };
  };
};
curry("hello")("world")("sushan");
