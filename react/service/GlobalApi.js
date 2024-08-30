import axios from "axios";

const API_KEY = import.meta.env.VITE_STRAPI_API_KEY;
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosClient = axios.create({
    baseURL: `${BASE_URL}/api/`,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
    }
});

const createNewResume = (data) => axiosClient.post('/user-resumes', data);

const getUserResumes = (userEmail) => axiosClient.get("/user-resumes?filters[userEmail][$eq]="+userEmail)

const UpdateResumeDetail = (id,data) => axiosClient.put("/user-resumes/"+id,data)

const GetResumeById=(id) => axiosClient.get('/user-resumes/'+ id + '?populate=*' )

const DeleteResumeById=(id) => axiosClient.delete('/user-resumes/' + id)

export default {
    createNewResume,
    getUserResumes,
    UpdateResumeDetail,
    GetResumeById,
    DeleteResumeById

};
