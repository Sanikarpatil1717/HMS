import axios from "axios";

const API_URL = "http://localhost:8888/appointments"; // Change this to your backend URL

// Book an appointment
export const bookAppointment = async (appointmentData) => {
  return axios.post(`${API_URL}/user/book`, appointmentData);
};

// Get appointments by user
export const getAppointmentsByUser = async (userId) => {
    if (!userId) {
      console.error("UserId is missing in API call!");
      return { data: [] };
    }
    console.log(`Making API call: ${API_URL}/user/${userId}`);
    return axios.get(`${API_URL}/user/${userId}`);
  };
  

export const getAppointmentsByDoctor = async (doctorId) => {
    try {
      console.log(`Calling API: ${API_URL}/doctor/${doctorId}`);
      const response = await axios.get(`${API_URL}/doctor/${doctorId}`);
      return response;
    } catch (error) {
      console.error("Error fetching appointments for doctor:", error);
      throw error;
    }
}

// Update appointment status
export const updateAppointmentStatus = async (id, status) => {
  return axios.put(`${API_URL}/${id}/update-status`, { status });
};

// Cancel appointment
export const cancelAppointment = async (id) => {
  return axios.delete(`${API_URL}/cancel/${id}`);
};
