import React, { useState } from 'react'
import { useLawListByCategory } from './api/useLawListByCategory'

export default function App() {
    const { data: laws, loading, error } = useLawListByCategory(1)

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 20
    const maxPageButtons = 10
    const totalPages = Math.ceil(laws.length / itemsPerPage)

    const startIndex = (currentPage - 1) * itemsPerPage
    const visibleLaws = laws.slice(startIndex, startIndex + itemsPerPage)

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
    if (error)   return <p className="text-red-600">エラー: {error.message}</p>
    if (laws.length === 0) return <p>データがありません (カテゴリ1)</p>

    return (
        <div className="p-4 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-center">法令一覧</h1>

            <ul className="list-disc list-inside mb-4">
                {visibleLaws.map((law) => (
                    <li key={law.id}>
                        {law.name} <span className="text-sm text-gray-500">({law.id})</span>
                    </li>
                ))}
            </ul>

            <div className="flex justify-center items-center space-x-1 mt-4 flex-wrap">
                {currentPage > 1 && (
                    <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="px-2 py-1 text-sm border rounded"
                    >
                        &lt;&lt;
                    </button>
                )}

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
        </div>
    )
}
