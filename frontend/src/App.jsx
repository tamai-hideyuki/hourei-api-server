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


    const fetchLawDetail = async (lawId, lawNameFromList) => {
        setSelectedLawId(lawId)
        setDetailLoading(true)
        setLawDetail(null)

        try {
            const res = await fetch(`/api/hourei/lawdata?lawId=${lawId}`)
            const xmlText = await res.text()
            const xml = new DOMParser().parseFromString(xmlText, 'application/xml')

            const lawName = lawNameFromList
            const articles = Array.from(xml.querySelectorAll('Article')).map((article) => {
                const title   = article.querySelector('ArticleTitle')?.textContent ?? ''
                const caption = article.querySelector('ArticleCaption')?.textContent ?? ''
                const sentences = Array.from(article.querySelectorAll('Sentence')).map(s => s.textContent.trim())
                return { title, caption, sentences }
            })
            setLawDetail({ name: lawName, articles })
        } catch (e) {
            setLawDetail({ error: e.message, articles: [] })
        } finally {
            setDetailLoading(false)
        }
    }

    // 検索フィルタリング
    const filteredLaws = laws.filter((law) =>
        law.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // ページネーション計算
    const totalPages = Math.ceil(filteredLaws.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const visibleLaws = filteredLaws.slice(startIndex, startIndex + itemsPerPage)

    const getPageNumbers = () => {
        const half = Math.floor(maxPageButtons / 2)
        // currentPage の前後に half ずつ余裕をもたせる
        let start = Math.max(1, currentPage - half)
        let end   = Math.min(totalPages, currentPage + half)

        // ページ数が maxPageButtons に満たないときは、足りない分を両端に振り分ける
        const shortage = maxPageButtons - (end - start + 1)
        if (shortage > 0) {
            // 前が足りなければ後ろに、後ろが足りなければ前に振る
            start = Math.max(1, start - shortage)
            end   = Math.min(totalPages, end + shortage)
        }

        // 最終調整：範囲を totalPages の中に収める
        start = Math.max(1, Math.min(start, totalPages - maxPageButtons + 1))
        end   = Math.min(totalPages, start + maxPageButtons - 1)

        return Array.from({ length: end - start + 1 }, (_, i) => start + i)
    }


    if (loading) return <p>法令一覧を読み込み中…</p>
    if (error)   return <p className="text-red-600">エラー: {error.message}</p>
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
                        setCurrentPage(1)
                    }}
                    className="w-full border rounded p-2 focus:outline-none focus:ring"
                />
            </div>

            {/* 一覧 */}
            <ul className="list-disc list-inside mb-4">
                {visibleLaws.map((law) => (
                    <li
                        key={law.id}
                        role="button"
                        tabIndex={0}
                        className="cursor-pointer text-blue-700 hover:underline"
                        onClick={() => fetchLawDetail(law.id, law.name)}
                    >
                        {law.name}{' '}
                        {law.id && <span className="text-sm text-gray-500">({law.id})</span>}
                    </li>
                ))}
            </ul>

            {/* 詳細表示 */}
            {selectedLawId && (
                <div className="mt-8 border-t pt-4">
                    <button
                        onClick={() => setSelectedLawId(null)}
                        className="mt-4 px-4 py-2 bg-gray-200 rounded"
                    >
                        閉じる
                    </button>
                    <h2 className="text-xl font-bold mb-2">法令詳細</h2>

                    {detailLoading && <p>読み込み中...</p>}

                    {lawDetail?.error && (
                        <p className="text-red-500">取得エラー: {lawDetail.error}</p>
                    )}

                    {lawDetail?.articles.length > 0 ? (
                        <div>
                            <p className="font-semibold mb-2">{lawDetail.name}</p>
                            <div className="space-y-4">
                                {lawDetail.articles.map((article, i) => (
                                    <div key={i} className="border-b pb-2">
                                        <p className="font-bold text-lg">
                                            {article.title}
                                            {article.caption && (
                                                <span className="text-sm text-gray-500">
                          {' '}{article.caption}
                        </span>
                                            )}
                                        </p>
                                        <div className="pl-4 mt-1 space-y-1">
                                            {article.sentences.map((text, j) => (
                                                <p key={j} className="text-sm whitespace-pre-wrap">
                                                    {text}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p>条文が存在しません</p>
                    )}

                    <button
                        onClick={() => setSelectedLawId(null)}
                        className="mt-4 px-4 py-2 bg-gray-200 rounded"
                    >
                        閉じる
                    </button>
                </div>
            )}

            {/* 動的ページネーション */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-1 mt-4 flex-wrap">
                    {/* 前へジャンプ */}
                    {currentPage > 1 && (
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className="px-2 py-1 text-sm border rounded"
                        >
                            &lt;&lt;
                        </button>
                    )}

                    {/* 先頭省略 */}
                    {(() => {
                        const pages = getPageNumbers()
                        const start = pages[0]
                        const end = pages[pages.length - 1]
                        return (
                            <>
                                {start > 1 && (
                                    <>
                                        <button onClick={() => setCurrentPage(1)}
                                                className="px-3 py-1 rounded border bg-white text-blue-500">
                                            1
                                        </button>
                                        <span className="px-1">…</span>
                                    </>
                                )}

                                {/* 中央ページ */}
                                {getPageNumbers().map(page => (
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

                                {end < totalPages && (
                                    <>
                                        <span className="px-1">…</span>
                                        <button onClick={() => setCurrentPage(totalPages)}
                                                className="px-3 py-1 rounded border bg-white text-blue-500">
                                            {totalPages}
                                        </button>
                                    </>
                                )}
                            </>
                        )
                    })()}

                    {/* 次へジャンプ */}
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
