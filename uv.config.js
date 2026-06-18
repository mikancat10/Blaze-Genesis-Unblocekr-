<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nebula Search</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            background-color: #0f111a;
            color: #ffffff;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            overflow: hidden;
        }

        .search-container {
            width: 100%;
            max-width: 650px;
            padding: 20px;
            text-align: center;
            animation: fadeIn 0.8s ease-out;
        }

        h1 {
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 10px;
            background: linear-gradient(45deg, #00f2fe, #4facfe);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: 1px;
        }

        p {
            color: #8f9cae;
            margin-bottom: 30px;
            font-size: 1rem;
        }

        .search-form {
            position: relative;
            width: 100%;
        }

        .search-input {
            width: 100%;
            padding: 18px 25px;
            font-size: 1.1rem;
            border: 2px solid #1f2335;
            border-radius: 50px;
            background-color: #1a1e30;
            color: #ffffff;
            outline: none;
            transition: all 0.3s ease;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        .search-input:focus {
            border-color: #00f2fe;
            background-color: #1f243a;
            box-shadow: 0 0 20px rgba(0, 242, 254, 0.3);
        }

        .search-btn {
            position: absolute;
            right: 8px;
            top: 8px;
            bottom: 8px;
            border: none;
            background: linear-gradient(45deg, #00f2fe, #4facfe);
            color: white;
            padding: 0 25px;
            border-radius: 40px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, opacity 0.2s;
        }

        .search-btn:hover {
            opacity: 0.9;
            transform: scale(1.02);
        }

        .search-btn:active {
            transform: scale(0.98);
        }

        footer {
            position: absolute;
            bottom: 20px;
            color: #4a526d;
            font-size: 0.85rem;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body>

    <div class="search-container">
        <h1>Ultraviolet</h1>
        <p>URLを入力するか、検索ワードを入力してWebサイトの制限を解除します</p>
        
        <form id="proxy-form" class="search-form">
            <input type="text" id="proxy-search" class="search-input" placeholder="URLを入力、または検索キーワードを入力..." autocomplete="off" required>
            <button type="submit" class="search-btn">Go</button>
        </form>
    </div>

    <footer>
        Powered by Ultraviolet Proxy Engine
    </footer>

    <script src="uv/uv.bundle.js" defer></script>
    <script src="uv/uv.config.js" defer></script>
    <script>
        document.getElementById('proxy-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const input = document.getElementById('proxy-search').value.trim();
            let url = input;

            if (!/^https?:\/\//i.test(url)) {
                if (url.includes('.') && !url.includes(' ')) {
                    url = 'https://' + url;
                } else {
                    url = 'https://www.google.com/search?q=' + encodeURIComponent(input);
                }
            }

            // Register service worker and redirect
            if ('serviceWorker' in navigator) {
                try {
                    // Register Ultraviolet service worker via setup script reference if needed,
                    // or directly use the config prefixes.
                    await navigator.serviceWorker.register('./uv.sw.js', {
                        scope: __uv$config.prefix
                    });
                    
                    const encodedUrl = __uv$config.prefix + __uv$config.encodeUrl(url);
                    window.location.href = encodedUrl;
                } catch(err) {
                    alert('Service Workerの登録に失敗しました: ' + err.message);
                }
            } else {
                alert('お使いのブラウザはService Workerをサポートしていません。');
            }
        });
    </script>
</body>
</html>
