'use client'

import SearchForm from "./search-form";
import Sort from "./sort";

const Feature = () => {

    return (
        <div style={{display: 'flex', gap: 20, margin: '30px 0'}}>
            <SearchForm />
            <Sort />
        </div>
    );
}
 
export default Feature;