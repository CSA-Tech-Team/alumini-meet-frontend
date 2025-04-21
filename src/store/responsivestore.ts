import { create } from "zustand";

type DyanmicScreenSize<T> = {
  xs: T;
  sm: T;
  md: T;
  lg: T;
  xl: T;
  "2xl": T;
};

export const screenSizes = ["xs", "sm", "md", "lg", "xl", "2xl"];
export const screenWidths = [361, 640, 768, 1024, 1280, 1536];

export const getScreenSize = (width: number) => {
  if (width < screenWidths[0]) return screenSizes[0];

  let currentSizeIndex = screenWidths.length - 1;
  for (let i = 1; i < screenWidths.length; i++) {
    if (width < screenWidths[i]) {
      currentSizeIndex = i - 1;
      break;
    }
  }
  return screenSizes[currentSizeIndex];
};

type State = {
  canvas: {
    backgroundColor: string;
  };
  shadow: {
    scale: DyanmicScreenSize<number>;
    lightPosition: DyanmicScreenSize<[x: number, y: number, z: number]>;
    backPlanePosition: DyanmicScreenSize<[x: number, y: number, z: number]>;
    backPlaneShadowOpacity: number;
  };
  timer: {
    fontSize: DyanmicScreenSize<number>;
    padding: number;
  };
};

type Action = {
  setBackgroundColor: (color: string) => void;
  setBackPlaneShadowOpacity: (opacity: number) => void;
};

export type ResponsiveStore = State & Action;

const useResponsiveStore = create<ResponsiveStore>()((set) => ({
  canvas: {
    backgroundColor: "#000",
  },
  setBackgroundColor: (color: string) =>
    set((state) => ({
      canvas: { ...state.canvas, backgroundColor: color },
    })),
  setBackPlaneShadowOpacity: (opacity: number) =>
    set((state) => ({
      shadow: { ...state.shadow, backPlaneShadowOpacity: opacity },
    })),
  timer: {
    fontSize: {
      xs: 40,
      sm: 70,
      md: 100,
      lg: 150,
      xl: 200,
      "2xl": 250,
    },
    padding: 15,
  },
  shadow: {
    lightPosition: {
      xs: [4, -1, 3],
      sm: [4.5, -1, 3],
      md: [5, -1, 3],
      lg: [5, -1, 3],
      xl: [6, -1, 3],
      "2xl": [7, -1, 3],
    },
    backPlanePosition: {
      xs: [0, -0.5, 0],
      sm: [0, -0.5, 0],
      md: [0, -0.8, 0],
      lg: [0, -0.8, 0],
      xl: [0, -0.9, 0],
      "2xl": [0, -1, 0],
    },
    scale: {
      xs: 0.7,
      sm: 1.0,
      md: 1.3,
      lg: 1.5,
      xl: 1.7,
      "2xl": 1.9,
    },
    backPlaneShadowOpacity: 0.6,
  },
}));

export default useResponsiveStore;
