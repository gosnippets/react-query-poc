import axios from "axios";

const api = axios.create({
  baseURL: "https://gorest.co.in/public/v1",
  headers: {
    Authorization:
      "Bearer 007799281949d89788d14812e4014006d629ed8ccd4d8941977827f383d4643a",
  },
});

export const addNewPost = async ({ title, body }) => {
  try {
    const { data } = await api.post("/users/1891/posts", { title, body });
    return data;
  } catch (error) {
    throw Error(error.response.statusText);
  }
};

export const updatePost = async ({ title, body, id }) => {
  try {
    const { data } = await api.patch("/posts/" + id, { title, body });
    return data;
  } catch (error) {
    throw Error(error.response.statusText);
  }
};

export const deletePost = async ({ id }) => {
  try {
    const { data } = await api.delete("/posts/" + id);
    return data;
  } catch (error) {
    throw Error(error.response.statusText);
  }
};

export const fetchPosts = async () => {
  try {
    const { data } = await api.get("/posts");
    return data;
  } catch (error) {
    throw Error("Unable to fetch Posts");
  }
};

export const fetchInfinityPosts = async (pageParam) => {
  try {
    const { data } = await api.get("/posts?page=" + pageParam);
    return data;
  } catch (error) {
    throw Error("Unable to fetch Posts");
  }
};

export const fetchPost = async (id) => {
  try {
    const { data } = await api.get("/posts/" + id);
    return data;
  } catch (error) {
    throw Error("Unable to fetch Post");
  }
};
