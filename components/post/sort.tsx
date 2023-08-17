'use client'

import { useCustomRouter } from "@/hooks/useCustomRouter";

const Sort = () => {
    const {pushQuery, query} = useCustomRouter();
    return (
        <div>
            Sort: {``}
            <select value={query.sort || ''} onChange={(e)=>pushQuery({sort: e.target.value})}>
                <option value="createdAt">a-z</option>
                <option value="-createdAt">z-a</option>
            </select>
        </div>
    );
}
 
export default Sort;