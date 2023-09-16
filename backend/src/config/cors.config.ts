import { CorsOptions } from "cors";
import { allowOriginDev, allowOriginProd, isDevelopment } from "../constants/api";

export const corsConfig: CorsOptions = {
  origin: isDevelopment ? allowOriginDev : allowOriginProd,
};
