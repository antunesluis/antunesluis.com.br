export type ActionResult = {
  errors: string[];
  success: boolean;
};

export type FormActionState<T> = ActionResult & {
  formState: T;
};
