import { useEffect, useState } from 'react';

function App() {
    const [laws, setLaws] = useState([]);
    const [selectedLaw, setSelectedLaw] = useState('');
    const [article, setArticle] = useState('第1条');      // 追加：条の state
    const [content, setContent] = useState('');

    useEffect(() => {
        fetch(import.meta.env.VITE_API_BASE_URL + '/api/hourei/lawlists/1')
            .then(res => res.text())
            .then(xml => {
                const doc = new DOMParser().parseFromString(xml, 'application/xml');
                const items = Array.from(doc.querySelectorAll('LawNameListInfo'));
                setLaws(items.map(el => ({
                    id: el.querySelector('LawId')?.textContent,
                    name: el.querySelector('LawName')?.textContent
                })));
            });
    }, []);

    const fetchArticle = () => {
        if (!selectedLaw || !article) return;
        const url = `${import.meta.env.VITE_API_BASE_URL}/api/hourei/articles?lawId=${selectedLaw}&article=${encodeURIComponent(article)}`;
        fetch(url)
            .then(res => res.text())
            .then(xml => {
                const doc = new DOMParser().parseFromString(xml, 'application/xml');
                setContent(doc.querySelector('LawContents')?.textContent || '取得失敗');
            });
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">法令検索UI</h1>

            {/* 法令選択 */}
            <select
                className="border p-2 mr-2 rounded focus:outline-none focus:ring"
                value={selectedLaw}
                onChange={e => setSelectedLaw(e.target.value)}
            >
                <option value="">法令を選択</option>
                {laws.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                ))}
            </select>

            {/* 条文指定用の入力 */}
            <input
                type="text"
                className="border p-2 mr-2 rounded focus:outline-none focus:ring"
                value={article}
                onChange={e => setArticle(e.target.value)}
                placeholder="第X条"
            />

            {/* 実行ボタン */}
            <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                onClick={fetchArticle}
            >
                条文を取得
            </button>

            {/* 結果表示 */}
            <pre className="mt-4 bg-gray-100 p-4 rounded whitespace-pre-wrap">
                {content}
            </pre>
        </div>
    );
}

export default App;
