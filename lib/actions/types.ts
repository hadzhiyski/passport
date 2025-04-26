export type ValidationErrors = {
  [key: string]: string[];
};

export type ActionResponse =
  | { success: true }
  | { success: false; errors: ValidationErrors }
  | { success: false; error: string };
