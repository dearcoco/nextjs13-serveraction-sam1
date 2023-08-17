'use client'

import { useCustomRouter } from "@/hooks/useCustomRouter";

const Pagination = ({totalPage}: {totalPage: number}) => {
    const arr = [...Array(totalPage)].map((_, i) => i + 1);
    const {pushQuery, query} = useCustomRouter();
    
    return (
        <div style={{display: 'flex', gap: 10, margin: '30px 0'}}>
            {
                arr.map((page) => (
                    <button key={page} 
                        onClick={() => pushQuery({page: page.toString()})} 
                        style={{background: (query.page || "1") === page.toString() ? 'red' : ''}}>
                        {page}
                    </button>
                ))
            }
        </div>
    );
}
 
export default Pagination;