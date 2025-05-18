import React, { useState } from 'react'
import { useLawListByCategory } from './api/useLawListByCategory'

export default function App() {
    const { data: laws, loading, error } = useLawListByCategory(1)

    if (loading) return <p>法令一覧を読み込み中…</p>
    if (error)   return <p className="text-red-600">エラー: {error.message}</p>
    if (laws.length === 0) return <p>データがありません (カテゴリ1)</p>

    return (
        <div className="p-4 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-center">カテゴリ1の法令一覧</h1>
            <ul className="list-disc list-inside">
                {laws.map(law => (
                    <li key={law.id}>
                        {law.name} <span className="text-sm text-gray-500">({law.id})</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
