export interface StlDataState {
  weight: number | string;
  material: number | string;
  infill: number | string;
  shipping: number | string;
  quantity: number | string;
  color: number | string;
  stlFile: File | null;
  setWeight: (weight: number | string) => void;
  setMaterial: (material: number | string) => void;
  setInfill: (infill: number | string) => void;
  setShipping: (shipping: number | string) => void;
  setQuantity: (quantity: number | string) => void;
  setColor: (color: number | string) => void;
  setStlFile: (stlFile: File | null) => void;
}

export interface RouterGuardState {
  accessUserDetails: boolean;
  enableAccessUserDetails: () => void;
  disableAccessUserDetails: () => void;
}
