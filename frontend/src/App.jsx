import React, { useState } from 'react'
import { useLawListByCategory } from './api/useLawListByCategory'
import './index.css'

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
            const articles = Array.from(xml.querySelectorAll('Article')).map(a => ({
                title:   a.querySelector('ArticleTitle')?.textContent ?? '',
                caption: a.querySelector('ArticleCaption')?.textContent ?? '',
                sentences: Array.from(a.querySelectorAll('Sentence'))
                    .map(s => s.textContent.trim())
            }))
            setLawDetail({ name: lawNameFromList, articles })
        } catch (e) {
            setLawDetail({ error: e.message, articles: [] })
        } finally {
            setDetailLoading(false)
        }
    }

    const filteredLaws = laws.filter(law =>
        law.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const totalPages = Math.ceil(filteredLaws.length / itemsPerPage)
    const visibleLaws = filteredLaws.slice(
        (currentPage - 1) * itemsPerPage,
        (currentPage - 1) * itemsPerPage + itemsPerPage
    )

    const getPageNumbers = () => {
        const half = Math.floor(maxPageButtons / 2)
        let start = Math.max(1, currentPage - half)
        let end   = Math.min(totalPages, currentPage + half)
        const shortage = maxPageButtons - (end - start + 1)
        if (shortage > 0) {
            start = Math.max(1, start - shortage)
            end   = Math.min(totalPages, end + shortage)
        }
        start = Math.max(1, Math.min(start, totalPages - maxPageButtons + 1))
        end   = Math.min(totalPages, start + maxPageButtons - 1)
        return Array.from({ length: end - start + 1 }, (_, i) => start + i)
    }

    if (loading) return <p className="loading-text">法令一覧を読み込み中…</p>
    if (error)   return <p className="error-text">エラー: {error.message}</p>
    if (!laws.length) return <p className="no-data-text">データがありません</p>

    return (
        <div className="app-container">
            <div className="columns">

                {/* 左カラム：一覧 */}
                <div className="column-left">
                    <h1 className="heading">法令一覧</h1>
                    <input
                        type="text"
                        placeholder="法令名で検索"
                        value={searchQuery}
                        onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                        className="search-input"
                    />

                    <ul className="law-list">
                        {visibleLaws.map(law => (
                            <li
                                key={law.id}
                                role="button"
                                onClick={() => fetchLawDetail(law.id, law.name)}
                                className="law-item"
                            >
                                {law.name}
                                {law.id && <span className="law-id">({law.id})</span>}
                            </li>
                        ))}
                    </ul>

                    {totalPages > 1 && (
                        <div className="pagination">
                            {currentPage > 1 && (
                                <button
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    className="btn"
                                >
                                    &lt;&lt;
                                </button>
                            )}
                            {getPageNumbers().map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`btn ${currentPage === page ? 'active' : ''}`}
                                >
                                    {page}
                                </button>
                            ))}
                            {currentPage < totalPages && (
                                <button
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    className="btn"
                                >
                                    &gt;&gt;
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* 右カラム：詳細 */}
                {selectedLawId && (
                    <div className="column-right">
                        <button
                            onClick={() => setSelectedLawId(null)}
                            className="btn close-btn"
                        >
                            閉じる
                        </button>

                        <h2 className="heading">法令詳細</h2>

                        {detailLoading && <p className="loading-text">読み込み中…</p>}
                        {lawDetail?.error && <p className="error-text">取得エラー: {lawDetail.error}</p>}

                        {lawDetail?.articles.length > 0 ? (
                            <div className="articles">
                                {lawDetail.articles.map((article, i) => (
                                    <div key={i} className="article">
                                        <p className="article-title">
                                            {article.title}
                                            {article.caption && (
                                                <span className="article-caption">
                          {' '}{article.caption}
                        </span>
                                            )}
                                        </p>
                                        <div className="article-content">
                                            {article.sentences.map((t, j) => (
                                                <p key={j} className="article-text">
                                                    {t}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-data-text">条文が存在しません</p>
                        )}

                        <button
                            onClick={() => setSelectedLawId(null)}
                            className="btn close-btn"
                        >
                            閉じる
                        </button>
                    </div>
                )}

            </div>
        </div>
    )
}
