import axiosMain from "@/lib/axiosInstance";

export const ownerApi = {
  createTurfRequest: (data) =>
    axiosMain.post("/turf-create-request", data, { skipAuth: true }),
};
