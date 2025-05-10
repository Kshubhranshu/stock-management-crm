import toast from "react-hot-toast";

export const handleError = (functionName, error) => {
    console.error(`Error in ${functionName}:`, error);

    const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";

    toast.error(errorMessage);

    return error;
};
