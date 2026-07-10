import axiosMain from "@/lib/axiosInstance";

export const authApi = {
  sendOtp: (mobile, type) =>
    axiosMain.post("/auth/send-otp", { mobile, type }),

  verifyOtp: (mobile, otp, type) =>
    axiosMain.post("/auth/verify-otp", { mobile, otp, type }),

  signup: (data) => axiosMain.post("/auth/signup", data),
};
