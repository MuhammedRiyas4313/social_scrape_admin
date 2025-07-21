import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_ENDPOINT } from "./url.service";
import { PLATFORM_TYPE } from "@/common/constants.common";

export interface ISearch {
  keyword: string;
  platform: PLATFORM_TYPE;
  timeframe: string;
}

const scrape = (obj: Partial<ISearch>) => {
  return axios.post(API_ENDPOINT("/scrape"), obj);
};

export const useScrape = () => {
  return useMutation({
    mutationFn: scrape,
  });
};

export interface IAnalyse {
  posts: any
}

const analyze = (obj: Partial<IAnalyse>) => {
  return axios.post(API_ENDPOINT("/analyze"), obj);
};

export const useAnalyze = () => {
  return useMutation({
    mutationFn: analyze,
  });
};
