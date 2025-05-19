import React, { useState } from 'react'
import { useLawListByCategory } from './api/useLawListByCategory'

export default function App() {
    const { data: laws, loading, error } = useLawListByCategory(1)

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 20
    const startIndex = (currentPage - 1) * itemsPerPage
    const visibleLaws = laws.slice(startIndex, startIndex + itemsPerPage)

    if (loading) return <p>法令一覧を読み込み中…</p>
    if (error)   return <p className="text-red-600">エラー: {error.message}</p>
    if (laws.length === 0) return <p>データがありません (カテゴリ1)</p>

    return (
        <div className="p-4 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-center">カテゴリ1の法令一覧</h1>

            <ul className="list-disc list-inside mb-4">
                {visibleLaws.map((law) => (
                    <li key={law.id}>
                        {law.name} <span className="text-sm text-gray-500">({law.id})</span>
                    </li>
                ))}
            </ul>

            <div className="flex justify-center space-x-2 mt-4">
                {Array.from({ length: Math.ceil(laws.length / itemsPerPage) }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 rounded border ${
                            currentPage === i + 1
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-blue-500'
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    )
}
