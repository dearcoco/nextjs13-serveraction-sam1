'use client'

import {useCustomRouter} from "@/hooks/useCustomRouter";
import SubmitButton from "../global/submit-button";

const SearchForm = () => {
    const { pushQuery, query } = useCustomRouter();

    async function handleSearch(formData: FormData) {
        const search = formData.get('search')!.toString();
        
        pushQuery({search, page: "1"});
    }

    return (
        <form action={handleSearch}>
            <input type="search" name="search" placeholder="search" 
                defaultValue={query.search || ''} />
            <SubmitButton value="search" />
        </form>
    );
}
 
export default SearchForm;