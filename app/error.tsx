'use client'

export default function Error({
	error,
    reset,
}: {
	error: Error;
    reset: () => void;
}) {
	return (
    	<div>
            <h2>Something went wrong!</h2>
            <p style={{margin:'20px 0'}}>{error.name}</p>
            <p style={{margin:'20px 0'}}>{error.message}</p>
            <p style={{margin:'20px 0'}}>{error.stack}</p>
        </div>
    );
}