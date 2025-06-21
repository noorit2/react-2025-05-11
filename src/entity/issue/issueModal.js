import axios from "axios";
import { stringify } from "querystring";
export async function getIssuesModal(data){
 
    try {
        console.log(data);
        
      const response =  await axios.get(`/api/github-issues?${stringify(mapQueryData(data))}`);

      console.log(response);
      
        if(response.status === 200){
          return response.data;
        }else{
          throw Error(response.data?.message);
        }
     } catch (error) {
        console.log(error);
        
       throw error;
     }
  }

  export const mapQueryData = (rawData) => {
        
    return {
      ...rawData,
       [rawData?.filter?.field]: [rawData?.filter?.value]
    }
    
    }

