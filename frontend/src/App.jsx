import React, { useState } from 'react'
import { useLawListByCategory } from './api/useLawListByCategory'

export default function App() {
    const { data: laws, loading, error } = useLawListByCategory(1)

    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 20
    const maxPageButtons = 10
    const [selectedLawId, setSelectedLawId] = useState(null)
    const [lawDetail, setLawDetail] = useState(null)
    const [detailLoading, setDetailLoading] = useState(false)

    const fetchLawDetail = async (lawId) => {
        setSelectedLawId(lawId)
        setDetailLoading(true)
        setLawDetail(null)

        try {
            const res = await fetch(`/api/hourei/lawdata?lawId=${lawId}`)
            const xmlText = await res.text()
            const xml = new DOMParser().parseFromString(xmlText, 'application/xml')

            const lawName = xml.querySelector('LawName')?.textContent ?? '名称不明'
            const paragraphs = Array.from(xml.querySelectorAll('Sentence')).map(
                (el) => el.textContent.trim()
            )

            setLawDetail({ name: lawName, paragraphs })
        } catch (e) {
            setLawDetail({ error: e.message })
        } finally {
            setDetailLoading(false)
        }
    }

    // フィルタリング（検索クエリ対応）
    const filteredLaws = laws.filter((law) =>
        law.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // ページネーション
    const totalPages = Math.ceil(filteredLaws.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const visibleLaws = filteredLaws.slice(startIndex, startIndex + itemsPerPage)

    // 表示するページ番号リスト
    const getPageNumbers = () => {
        const half = Math.floor(maxPageButtons / 2)
        let start = Math.max(currentPage - half, 1)
        let end = start + maxPageButtons - 1

        if (end > totalPages) {
            end = totalPages
            start = Math.max(end - maxPageButtons + 1, 1)
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i)
    }

    if (loading) return <p>法令一覧を読み込み中…</p>
    if (error) return <p className="text-red-600">エラー: {error.message}</p>
    if (laws.length === 0) return <p>データがありません</p>

    return (
        <div className="p-4 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-center">法令一覧</h1>

            {/* 検索バー */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="法令名で検索"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setCurrentPage(1) // 検索時は先頭ページに戻す
                    }}
                    className="w-full border rounded p-2 focus:outline-none focus:ring"
                />
            </div>

            {/* 一覧 */}
            <ul className="list-disc list-inside mb-4">
                {visibleLaws.map((law) => (
                    <li
                        key={law.id}
                        className="cursor-pointer text-blue-700 hover:underline"
                        onClick={() => fetchLawDetail(law.id)}
                    >
                        {law.name}{' '}
                        <span className="text-sm text-gray-500">({law.id})</span>
                    </li>
                ))}
            </ul>

            {/* ページネーション */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-1 mt-4 flex-wrap">
                    {currentPage > 1 && (
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className="px-2 py-1 text-sm border rounded"
                        >
                            &lt;&lt;
                        </button>
                    )}

                    {selectedLawId && (
                        <div className="mt-8 border-t pt-4">
                            <h2 className="text-xl font-bold mb-2">法令詳細</h2>

                            {detailLoading && <p>読み込み中...</p>}

                            {lawDetail?.error && (
                                <p className="text-red-500">取得エラー: {lawDetail.error}</p>
                            )}

                            {lawDetail?.paragraphs && (
                                <div>
                                    <p className="font-semibold mb-2">{lawDetail.name}</p>
                                    <div className="space-y-2">
                                        {lawDetail.paragraphs.map((text, i) => (
                                            <p key={i} className="text-sm whitespace-pre-wrap">{text}</p>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <button onClick={() => setSelectedLawId(null)}>閉じる</button>

                    {getPageNumbers().map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 rounded border ${
                                currentPage === page
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white text-blue-500'
                            }`}
                        >
                            {page}
                        </button>
                    ))}

                    {currentPage < totalPages && (
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            className="px-2 py-1 text-sm border rounded"
                        >
                            &gt;&gt;
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}
