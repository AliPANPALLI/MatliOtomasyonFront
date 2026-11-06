export interface SignInFormData {
  sicilNo: string;
  password: string;
  keepLoggedIn?: boolean;
}

export const signInValidationRules = {
  sicilNo: {
    required: 'Sicil No zorunludur',
  },
  password: {
    required: 'Password is required',
  },
};
