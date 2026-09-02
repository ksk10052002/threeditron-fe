// import { StlDataState } from "@/types/type";
// import { create } from "zustand";

// export const stlDetailsStore = create<StlDataState>((set) => ({
//   weight: "",
//   material: "",
//   infill: "",
//   shipping: "",
//   quantity: 1,
//   color: "",
//   stlFile: null,
//   setWeight: (weight) => set({ weight }),
//   setMaterial: (material) => set({ material }),
//   setInfill: (infill) => set({ infill }),
//   setShipping: (shipping) => set({ shipping }),
//   setQuantity: (quantity) => set({ quantity }),
//   setColor: (color) => set({ color }),
//   setStlFile: (stlFile) => set({ stlFile }),
// }));

import { StlDataState } from "@/types/type";
import { create } from "zustand";

export const stlDetailsStore = create<StlDataState>((set) => ({
  weight: "",
  material: "",
  infill: "",
  shipping: "",
  quantity: 1,
  color: "",

  stlFile: null,

  // NEW
  fileKey: "",
  fileName: "",
  estimatedPrice: 0,

  setWeight: (weight) => set({ weight }),
  setMaterial: (material) => set({ material }),
  setInfill: (infill) => set({ infill }),
  setShipping: (shipping) => set({ shipping }),
  setQuantity: (quantity) => set({ quantity }),
  setColor: (color) => set({ color }),

  setStlFile: (stlFile) => set({ stlFile }),

  // NEW
  setFileKey: (fileKey) => set({ fileKey }),
  setFileName: (fileName) => set({ fileName }),
  setEstimatedPrice: (estimatedPrice) => set({ estimatedPrice }),
}));
