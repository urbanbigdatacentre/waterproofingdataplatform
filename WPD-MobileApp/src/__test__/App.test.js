import React from "react";
import renderer from "react-test-renderer";

import App from "../App";

jest.useFakeTimers();

// NOTE: Just an toy example for verifying if Jest is running
describe("Jest initialization test", () => {
  it("Knows how to sum", () => {
    expect(1 + 1).toBe(2);
  });
});


// NOTE: Testing a snapshot
it('Renders correctly', () => {
  const tree = renderer.create(<App />).toJSON();
  expect(tree).toMatchSnapshot();
});


//FIXME:currently, I can't run the example that is in the expo documentation
// -> https://docs.expo.io/guides/testing-with-jest/#unit-test
// describe("<App />", () => {
//   it("has 1 child", () => {
//     const tree = renderer.create(<App />).toJSON();
//     expect(tree.children.length).toBe(1);
//   });
// });
