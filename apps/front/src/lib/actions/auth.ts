"use server";
import axios from "axios";
import { SignUpFormState } from "../types/formState";
import { SignUpFormSchema } from "../zodSchemas/signUpFormSchema";
import { redirect } from "next/navigation";
import { loginFormSchema } from "../zodSchemas/loginFormSchema";
import { revalidatePath } from "next/cache";
import { createSession } from "../session";

// Create an axios instance with base URL from environment variable
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

export async function signUp(
  state: SignUpFormState | void,
  formData: FormData,
): Promise<SignUpFormState | void> {
  // void to allow redirect
  // Convert FormData to a plain object
  const formDataObj = Object.fromEntries(formData.entries());
  const formValues: Record<string, any> = { ...formDataObj };

  // Convert checkbox value to boolean
  if (formValues.termsAccepted === "on") {
    formValues.termsAccepted = true;
  }
  const avatarFile = formData.get("avatar");
  if (avatarFile instanceof File) {
    formValues.avatar = avatarFile; // Zod will now see a File instance
  } else {
    formValues.avatar = null; // Ensure it's null if no file was selected, to match schema's .nullable()
  }
  // Validate form fields using Zod
  const validatedFields = SignUpFormSchema.safeParse(formValues);

  if (!validatedFields.success) {
    // When returning errors, make sure to not return the File object in `data`
    // because `input type="file"` cannot be re-populated with a default value.
    const dataToReturn = { ...formDataObj } as any; // Use formDataObj to keep other original form values
    if (dataToReturn.avatar instanceof File) {
      delete dataToReturn.avatar; // Remove the File object from data
    }
    return {
      data: dataToReturn,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please correct the errors in the form.",
    };
  }

  // Attempt to register user
  try {
    // --- NEW: Construct a new FormData object for the API call ---
    // This is vital for sending the file along with other data as multipart/form-data.
    const apiFormData = new FormData();

    // Append validated non-file fields to the new apiFormData.
    // Use `validatedFields.data` as it contains the parsed and validated values.
    apiFormData.append("firstName", validatedFields.data.firstName);
    apiFormData.append("lastName", validatedFields.data.lastName);
    apiFormData.append("email", validatedFields.data.email);
    apiFormData.append("password", validatedFields.data.password);
    apiFormData.append("role", validatedFields.data.role);

    // Append optional fields only if they have values after Zod validation
    if (validatedFields.data.contactInfo) {
      apiFormData.append("contactInfo", validatedFields.data.contactInfo);
    }
    if (validatedFields.data.companyName) {
      apiFormData.append("companyName", validatedFields.data.companyName);
    }
    if (validatedFields.data.location) {
      apiFormData.append("location", validatedFields.data.location);
    }

    // Append the validated avatar file if it exists.
    // `validatedFields.data.avatar` will be the actual File object or `null`.
    if (validatedFields.data.avatar) {
      apiFormData.append("avatar", validatedFields.data.avatar); // Append the actual File object
    }
    // --- END NEW ---

    // Make the API call using the new apiFormData.
    // Axios will automatically set the 'Content-Type: multipart/form-data' header.
    await api.post("api/auth/register", apiFormData); // Verify your Axios base URL and API path
  } catch (error) {
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data?.message || error.message || "Something went wrong"
      : "An unexpected error occurred";

    // Extract detailed errors from the backend response if available
    const errorDetails =
      axios.isAxiosError(error) && error.response?.data?.errors
        ? error.response.data.errors
        : {};

    // Prepare data for form re-population on error (again, without the File object)
    const dataToReturn = { ...formDataObj } as any;
    if (dataToReturn.avatar instanceof File) {
      delete dataToReturn.avatar;
    }

    return {
      data: dataToReturn,
      message: errorMessage,
      errors: errorDetails,
    };
  }

  redirect("/auth/signin");
}
export async function signIn(
  state: SignUpFormState | void, // Using SignUpFormState for consistency, consider a specific SignInFormState
  formData: FormData,
): Promise<SignUpFormState | void> {
  // void to allow redirect
  const formDataObj = Object.fromEntries(formData.entries());

  // Validate form fields using Zod
  const validatedFields = loginFormSchema.safeParse(formDataObj);
  console.log(process.env.NEXT_PUBLIC_BACKEND_URL, "backend url");
  if (!validatedFields.success) {
    return {
      data: formDataObj as any, // Cast to any or ensure SignUpFormState.data is compatible
      errors: validatedFields.error.flatten().fieldErrors as any, // Cast to any or ensure SignUpFormState.errors is compatible
    };
  }

  // Attempt to log in user
  try {
    // The validatedFields.data will contain the credentials (e.g., email, password)
    // as defined in your loginFormSchema
    const response = await api.post("/api/auth/login", validatedFields.data);
    const user = response.data.user; // Assuming the API returns user data in this format
    await createSession({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        email: user.email,
      },
      accessToken: response.data.access_token, // Assuming the API returns an access token
    });
    console.log("access token", response.data.access_token);
  } catch (error) {
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data?.message ||
        error.message ||
        "Login failed. Please check your credentials."
      : "An unexpected error occurred during login.";

    return {
      data: formDataObj as any, // Return the submitted data for re-populating the form
      message: errorMessage, // Provide an error message to display to the user
    };
  }

  revalidatePath("/"); // Revalidate the home page or any other path as needed
  redirect("/"); // Example redirect path
}
