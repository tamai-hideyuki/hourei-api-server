import { useEffect, useState } from 'react';

function App() {
    const [laws, setLaws] = useState([]);
    const [selectedLaw, setSelectedLaw] = useState('');
    const [article, setArticle] = useState('1');       // 初期値を数字に変更
    const [content, setContent] = useState('');

    // 数字を「第X条」の漢数字表記に変換するヘルパー
    const toKanji = (n) => {
        const kanji = ['〇','一','二','三','四','五','六','七','八','九','十'];
        return '第' + (n <= 10 ? kanji[n] : n) + '条';
    };

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/hourei/lawlists/1`)
            .then((res) => res.text())
            .then((xml) => {
                const doc = new DOMParser().parseFromString(xml, 'application/xml');
                const items = Array.from(doc.querySelectorAll('LawNameListInfo'));
                setLaws(
                    items.map((el) => ({
                        id: el.querySelector('LawId')?.textContent,
                        name: el.querySelector('LawName')?.textContent,
                    }))
                );
            });
    }, []);

    // ボタンクリック時に数字かどうかを判定し、必要なら漢数字に変換して fetch
    const fetchArticle = () => {
        if (!selectedLaw || !article) return;

        // 全角数字や半角数字だけなら漢数字に変換
        const kanjiArticle = /^\d+$/.test(article)
            ? toKanji(Number(article))
            : article;

        // URLエンコードをかけて安全にパラメータを付与
        const url =
            `${import.meta.env.VITE_API_BASE_URL || ''}` +
            `/api/hourei/articles?lawId=${selectedLaw}` +
            `&article=${encodeURIComponent(kanjiArticle)}`;

        fetch(url)
            .then((res) => res.text())
            .then((xml) => {
                const doc = new DOMParser().parseFromString(xml, 'application/xml');
                setContent(doc.querySelector('LawContents')?.textContent || '取得失敗');
            })
            .catch(() => {
                setContent('通信エラー');
            });
    };

    return (
        <div className="p-4 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-center">法令検索UI</h1>

            {/* 法令選択 */}
            <select
                className="border p-2 mr-2 rounded focus:outline-none focus:ring mb-2 w-full"
                value={selectedLaw}
                onChange={(e) => setSelectedLaw(e.target.value)}
            >
                <option value="">法令を選択</option>
                {laws.map((l) => (
                    <option key={l.id} value={l.id}>
                        {l.name}
                    </option>
                ))}
            </select>

            {/* 条文番号指定 (数字 or 「第X条」どちらでもOK) */}
            <input
                type="text"
                className="border p-2 mr-2 rounded focus:outline-none focus:ring mb-2 w-full"
                value={article}
                onChange={(e) => setArticle(e.target.value)}
                placeholder="例: 1 または 第1条"
            />

            {/* 実行ボタン */}
             <button
               className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded w-full"
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
