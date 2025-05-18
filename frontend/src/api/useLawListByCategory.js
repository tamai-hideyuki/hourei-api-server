import { useEffect, useState } from 'react'

export const useLawListByCategory = (categoryId) => {
    const [data, setData]       = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError]     = useState(null)

    useEffect(() => {
        setLoading(true)
        fetch(`/api/hourei/lawlists/category/${categoryId}`)
            .then(res => {
                if (!res.ok) throw new Error(`Status ${res.status}`)
                return res.json()
            })
            .then(json => setData(json))
            .catch(err => setError(err))
            .finally(() => setLoading(false))
    }, [categoryId])

    return { data, loading, error }
}
