import api from "./api";

const BASE_URL_JOB = "jobs/job_post/";
const BASE_URL_INTERVIEW_QUESTION = "jobs/interview_question/";

export const getJobs = async () => {
  const response = await api.get(BASE_URL_JOB);
  return response.data;
};

export const getJob = async (id) => {
  const response = await api.get(`${BASE_URL_JOB}${id}/`);
  return response.data;
};

export const createJob = async (jobData) => {
  const response = await api.post(BASE_URL_JOB, jobData);
  return response.data;
};

export const updateJob = async (id, jobData) => {
  const response = await api.put(`${BASE_URL_JOB}${id}/`, jobData);
  return response.data;
};

export const deleteJob = async (id) => {
  const response = await api.delete(`${BASE_URL_JOB}${id}/`);
  return response.data;
};

export const updateJobStatus = async (id, statusData) => {
  const response = await api.patch(`${BASE_URL_JOB}${id}/`, statusData);
  return response.data;
};

export const generateJobSummary = async (jobId) => {
  const response = await api.post(`/jobs/job_post/${jobId}/generate_summary/`);
  return response.data;
};

export const generateJobQuestions = async (jobId) => {
  const response = await api.post(
    `/jobs/job_post/${jobId}/generate_questions/`,
  );
  return response.data;
};

export const getJobQuestions = async (jobId) => {
  const response = await api.get(`/jobs/interview_questions/?job_id=${jobId}`);
  return response.data;
};
