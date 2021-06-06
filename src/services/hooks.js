import { useState, useEffect } from 'react';

export const useAsyncRequest = (requestFunction, params) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const asyncCall = async () => {
            setIsLoading(true);
            try {
                const data = await requestFunction(params);
                setData(data)
            } catch (e) {
                setData([]);
                setError(e);
            }
            setIsLoading(false);
        }
        asyncCall();
    }, [requestFunction, params]);
    return { data, error, isLoading };
}