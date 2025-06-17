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


  const formValues: Record<string, any> = {
    ...formDataObj,
    latitude: formDataObj.latitude ? parseFloat(formDataObj.latitude as string) : null,
    longitude: formDataObj.longitude ? parseFloat(formDataObj.longitude as string) : null,
  };
  // Convert checkbox value to boolean
  if (formValues.termsAccepted === "on") {
    formValues.termsAccepted = true;
  }

  // Convert string numbers to actual numbers for coordinates
  if (formValues.latitude && formValues.latitude !== "") {
    formValues.latitude = parseFloat(formValues.latitude as string);
  }
  if (formValues.longitude && formValues.longitude !== "") {
    formValues.longitude = parseFloat(formValues.longitude as string);
  }

  // Remove any fields that shouldn't be in the validation
  // Sometimes FormData includes extra fields or duplicates
  const validationFields = {
    ...formValues,
  };
  console.log("type latitude:", typeof validationFields.latitude);

  const avatarFile = formData.get("avatar");
  if (avatarFile instanceof File) {
    formValues.avatar = avatarFile; // Zod will now see a File instance
  } else {
    formValues.avatar = null; // Ensure it's null if no file was selected, to match schema's .nullable()
  }

  // Validate form fields using Zod
  const validatedFields = SignUpFormSchema.safeParse(validationFields);
  console.log("Validated Fields:", validatedFields);
  if (!validatedFields.success) {
    console.error("Validation failed:", validatedFields.error.flatten());
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
    console.log("Proceeding with backend API request.");

    // --- NEW: Construct a new FormData object for the API call ---
    // This is vital for sending the file along with other data as multipart/form-data.
    const apiFormData = new FormData();

    // Append validated non-file fields to the new apiFormData.
    // Use `validatedFields.data` as it contains the parsed and validated values.
    const locationData = {
      latitude: Number(validatedFields.data.latitude),
      longitude: Number(validatedFields.data.longitude)
    };

    const otherData = {
      firstName: validatedFields.data.firstName,
      lastName: validatedFields.data.lastName,
      email: validatedFields.data.email,
      password: validatedFields.data.password,
      role: validatedFields.data.role,
      governorate: validatedFields.data.governorate,
      governorateAr: validatedFields.data.governorateAr,
      delegation: validatedFields.data.delegation,
      delegationAr: validatedFields.data.delegationAr,
      postalCode: validatedFields.data.postalCode,
      contactInfo: validatedFields.data.contactInfo || undefined,
      companyName: validatedFields.data.companyName || undefined,
    };
    console.log('avatar: ', validatedFields.data.avatar)
    if (validatedFields.data.avatar instanceof File && validatedFields.data.avatar.size > 0) {
      const formData = new FormData();
      formData.append('avatar', validatedFields.data.avatar);

      // Append other fields as strings
      Object.entries(otherData).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      // Add location data as a stringified JSON field
      formData.append('location', JSON.stringify(locationData));

      await api.post("api/auth/register", formData);
    } else {
      // Send all data as JSON when there's no file
      await api.post("api/auth/register", {
        ...otherData,
        ...locationData
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

  } catch (error) {
    if (axios.isAxiosError(error)) {
    }
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
