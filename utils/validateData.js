import { object, Schema, string } from "yup";

export const registerSchema = object({
  firstName: string().min(3, "First name must be at least 3 characters").required("First name is required"),
  lastName: string().min(3, "Last name must be at least 3 characters").required("Last name is required"),
  email: string().email("Invalid email format").required("Email is required"),
  password: string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const validator = (Schema) => async (req, res, next) => {
  try {
    await Schema.validate(req.body,{abortEarly:false});
    next();
  } catch (error) {
    const errTxt = error.errors.join(", ");
    return res.status(400).json({
      message: errTxt,
    });
  }
};
