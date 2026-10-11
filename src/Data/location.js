import data from "./indiaStates.json";

// [{ state, districts }] -> { "Tamil Nadu": [...], ... }, sorted A–Z
const indiaStates = Object.fromEntries(
  [...data]
    .sort((a, b) => a.state.localeCompare(b.state))
    .map(({ state, districts }) => [
      state,
      [...districts].sort((a, b) => a.localeCompare(b)),
    ]),
);

export const locations = { India: indiaStates };
