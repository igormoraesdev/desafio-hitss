import { setUpTests } from "react-native-reanimated";

setUpTests();

jest.mock("@expo/vector-icons", () => jest.requireActual("./utils/iconMock"));
jest.mock("@expo/vector-icons/Feather", () =>
  jest.requireActual("./utils/iconMock"),
);
jest.mock("@expo/vector-icons/Entypo", () =>
  jest.requireActual("./utils/iconMock"),
);
jest.mock("@expo/vector-icons/AntDesign", () =>
  jest.requireActual("./utils/iconMock"),
);
jest.mock("@expo/vector-icons/MaterialCommunityIcons", () =>
  jest.requireActual("./utils/iconMock"),
);

const originalWarn = console.warn;
jest.spyOn(console, "warn").mockImplementation((...args: unknown[]) => {
  if (typeof args[0] === "string" && args[0].includes("SafeAreaView")) return;
  originalWarn(...args);
});
