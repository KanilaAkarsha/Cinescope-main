import API from "@/app/config/api";

export const getUsers = async () => {
  try {
    const { data } = await API.get("/api/users/admin/users");
    return { success: true, data: data.users };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const deleteUser = async (id) => {
  try {
    await API.delete(`/api/users/admin/users/${id}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const updateUserRole = async (id, role) => {
  try {
    const { data } = await API.put("/api/users/update", { id, role }); // Backend update takes ID and role
    return { success: true, data: data.user };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
