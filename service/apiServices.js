import axios, { AxiosHeaders } from "axios";

export const url = "https://stgapiv2.tarality.io/api/v1";

export const api = axios.create({
  baseURL: url,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});
