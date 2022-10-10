export default function requestPluviometerData() {
  console.log(Math.floor(Math.random() * 10));
  return {
    labels: ["1", "2", "3"],
    values: [1, 2, 3],
  };
}
