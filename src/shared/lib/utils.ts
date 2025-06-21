import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const Result = {
  Ok: (data) => {
      console.log(data);
      
      return {
          success: true,
          data:data,
      };
  },
  Err:(error) => (
      {
          success: false,
          error,
      }
  )
}