import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//Result utility for handling success and error responses to avoid error catch blocks in every function
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