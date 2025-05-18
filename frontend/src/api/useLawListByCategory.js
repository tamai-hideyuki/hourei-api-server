import { useEffect, useState } from 'react'

export const useLawListByCategory = (categoryId) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await fetch(`/api/hourei/lawlists/category/${categoryId}`)
                if (!res.ok) throw new Error('API取得に失敗しました')
                const json = await res.json()
                setData(json)
            } catch (err) {
                setError(err)
            } finally {
                setLoading(false)
            }
        }

        getData()
    }, [categoryId])

    return { data, loading, error }
}
