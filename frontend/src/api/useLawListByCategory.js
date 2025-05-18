import { useEffect, useState } from 'react'

export const useLawListByCategory = (categoryId) => {
    const [data, setData]       = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError]     = useState(null)

    useEffect(() => {
        setLoading(true)
        setError(null)

        fetch(`/api/hourei/lawlists/${categoryId}`)
            .then(res => {
                if (!res.ok) throw new Error(`Status ${res.status}`)
                return res.text()
            })
            .then(xmlText => {
                const xml = new DOMParser().parseFromString(xmlText, 'application/xml')
                const nodes = xml.querySelectorAll('LawNameListInfo')

                const parsed = Array.from(nodes).map(el => ({
                    id: el.querySelector('LawId')?.textContent ?? '不明ID',
                    name: el.querySelector('LawName')?.textContent ?? '不明名称',
                }))

                setData(parsed)
            })
            .catch(err => {
                setError(err)
                setData([])
            })
            .finally(() => setLoading(false))
    }, [categoryId])

    return { data, loading, error }
}