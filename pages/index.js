import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Guestbook() {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 從環境變數讀取 Supabase 設定
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 載入留言
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/messages?select=*&order=created_at.desc`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('載入失敗:', err);
    }
  };

  // 送出留言
  const handleSubmit = async () => {
    if (!name.trim() || !message.trim()) {
      setError('請填寫名字和留言內容');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/messages`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ 
          name: name.trim(), 
          message: message.trim() 
        })
      });

      if (response.ok) {
        setName('');
        setMessage('');
        fetchMessages();
      } else {
        setError('送出失敗,請稍後再試');
      }
    } catch (err) {
      console.error('送出失敗:', err);
      setError('送出失敗,請檢查網路連線');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>我的留言板</title>
        <meta name="description" content="使用 Next.js 和 Supabase 建立的留言板" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* 標題 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">📝 留言板</h1>
            <p className="text-gray-600">歡迎留下你的訊息!</p>
          </div>

          {/* 留言表單 */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                你的名字
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="請輸入名字"
                maxLength={100}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                留言內容
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                rows="4"
                placeholder="寫下你想說的話..."
                maxLength={500}
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? '送出中...' : '✨ 送出留言'}
            </button>
          </div>

          {/* 留言列表 */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">💬 所有留言</h2>
            {messages.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                還沒有留言,成為第一個留言的人吧!
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg text-indigo-600">
                      {msg.name}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {new Date(msg.created_at).toLocaleString('zh-TW', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap break-words">{msg.message}</p>
                </div>
              ))
            )}
          </div>

          {/* 頁尾 */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>🚀 使用 Next.js + Supabase 建立</p>
          </div>
        </div>

        <style jsx global>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
              'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
              sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        `}</style>
      </div>
    </>
  );
}
