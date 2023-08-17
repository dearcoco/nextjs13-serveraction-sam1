import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export type PostQuery = {
    search?: string;
    sort?: string;
    limit?: string;
    page?: string;
    skip?: string;
}

export const useCustomRouter = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query: PostQuery = {};
    
    let search = searchParams?.get('search');
    if (search) { 
        query.search = search;
    }
    let sort = searchParams?.get('sort');
    if (sort) {
        query.sort = sort;
    }
    let page = searchParams?.get('page');
    if (page) {
        query.page = page;
    }

    const pushQuery = (pq: PostQuery) => {
        if (pq.search !== undefined) {
            pq.search === '' 
                ? delete query.search 
                : query.search = pq.search!;
        }
        if (pq.sort !== undefined) {
            pq.sort === 'createdAt' 
                ? delete query.sort 
                : query.sort = pq.sort!;
        }
        if (pq.page !== undefined) {
            query.page = pq.page;
            // pq.page === "1" 
            //     ? delete query.page 
            //     : query.page = pq.page;
        }

        const new_query = new URLSearchParams(query).toString();
        router.push(`?${new_query}`);
        console.log(`${new_query}`);
    }

    return { pushQuery, query }
}

