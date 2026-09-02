export interface registerForm {
  gender: string;
  firstName: string;
  middleName: string;
  lastName: string;
  countryCode: string;
  mobileNumber: string;
  parentMobile: string;
  emailId: string;
  dateOfBirth: string;
  courseType: string;
  choiceOfCourse: string;
  country: string;
  state: string;
  city: string;
  address: string;
  agreedToTerms: boolean;
}

export interface StlDataState {
  weight: number | string;
  material: number | string;
  infill: number | string;
  shipping: number | string;
  quantity: number | string;
  color: number | string;

  stlFile: File | null;

  // NEW
  fileKey: string;
  fileName: string;
  estimatedPrice: number;

  setWeight: (weight: number | string) => void;
  setMaterial: (material: number | string) => void;
  setInfill: (infill: number | string) => void;
  setShipping: (shipping: number | string) => void;
  setQuantity: (quantity: number | string) => void;
  setColor: (color: number | string) => void;

  setStlFile: (stlFile: File | null) => void;

  // NEW
  setFileKey: (fileKey: string) => void;
  setFileName: (fileName: string) => void;
  setEstimatedPrice: (estimatedPrice: number) => void;
}

export interface RouterGuardState {
  accessUserDetails: boolean;
  enableAccessUserDetails: () => void;
  disableAccessUserDetails: () => void;
}
