// src/api/useLawArticle.js
import { useState } from 'react'

export const useLawArticle = (lawId, articleParam) => {
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchContent = async () => {
        if (!lawId || !articleParam) return

        setLoading(true)
        setError(null)

        try {
            // 数字だけなら漢数字に変換する処理をお好みで挿入
            const url = `/api/hourei/articles?lawId=${lawId}&article=${encodeURIComponent(articleParam)}`

            const res = await fetch(url)
            if (!res.ok) throw new Error(`ステータス ${res.status}`)

            const xml = await res.text()
            const doc = new DOMParser().parseFromString(xml, 'application/xml')
            const node = doc.querySelector('LawContents')
            setContent(node?.textContent || '（内容が見つかりません）')
        } catch (err) {
            setError(err)
        } finally {
            setLoading(false)
        }
    }

    return { content, loading, error, fetchContent }
}
