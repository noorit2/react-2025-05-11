import { getIssuesModal } from "./issueModal";
import { Result } from "../../shared/lib/utils";
export const getIssues = async (data) => {
    try{
        const response = await getIssuesModal(data);        
        return Result.Ok(response);
    }catch(e){
        return Result.Err(e.message);
    }
}