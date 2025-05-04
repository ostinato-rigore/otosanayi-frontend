export const validateRegisterForm = (formData, setError) => {
  const { email, password, name } = formData;

  if (!email || !password || !name) {
    setError("Please fill all required fields");
    return false;
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    setError("Please enter a valid email address");
    return false;
  }
  if (password.length < 8) {
    setError("Password must be at least 8 characters long");
    return false;
  }
  return true;
};

export const validateLoginForm = (email, password, setError) => {
  if (!email || !password) {
    setError("Please fill all fields");
    return false;
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    setError("Please enter a valid email address");
    return false;
  }
  return true;
};
