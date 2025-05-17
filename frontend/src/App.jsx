import { useEffect, useState } from 'react';

function App() {
    const [laws, setLaws] = useState([]);
    const [selected, setSelected] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        fetch(import.meta.env.VITE_API_BASE_URL + '/api/hourei/lawlists/1')
            .then(res => res.text())
            .then(xml => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(xml, 'application/xml');
                const items = Array.from(doc.querySelectorAll('LawNameListInfo'));
                setLaws(items.map(el => ({
                    id: el.querySelector('LawId')?.textContent,
                    name: el.querySelector('LawName')?.textContent
                })));
            });
    }, []);

    const fetchArticle = () => {
        if (!selected) return;
        const url = `${import.meta.env.VITE_API_BASE_URL}/api/hourei/articles?lawId=${selected}&article=第1条`;
        fetch(url)
            .then(res => res.text())
            .then(xml => {
                const doc = new DOMParser().parseFromString(xml, 'application/xml');
                setContent(doc.querySelector('LawContents')?.textContent || '取得失敗');
            });
    };

    return (
        <div className="p-4">
            <h1 className="text-xl mb-2">法令検索UI</h1>
            <select
                className="border p-1 mr-2"
                value={selected}
                onChange={e => setSelected(e.target.value)}
            >
                <option value="">法令を選択</option>
                {laws.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                ))}
            </select>
            <button className="bg-blue-500 text-white px-3" onClick={fetchArticle}>
                第1条を取得
            </button>
            <pre className="mt-4 whitespace-pre-wrap">{content}</pre>
        </div>
    );
}

export default App;
