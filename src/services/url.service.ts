export const baseUrl = import.meta.env.VITE_API_URL;
export const API_FULL_BASE_URL = `${import.meta.env.VITE_API_URL}/api/${import.meta.env.VITE_API_VERSION}`;

export const API_ENDPOINT = (path: string) => 
  `${API_FULL_BASE_URL}${path && path.startsWith('/') ? path : `/${path}`}`;

export type GeneralApiResponse<T = unknown> = {
  message: string;
  data: T;
};

export type GeneralApiResponsePagination<T = unknown> = {
  message: string;
  data: T[];
  total: number;
};
