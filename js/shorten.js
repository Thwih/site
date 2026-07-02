const CACHE_KEY = 'shorten_cache_v8';

        function getCache() {
            try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || {}; } catch { return {}; }
        }

        function setCache(originalUrl, cachedUrl) {
            const cache = getCache();
            cache[originalUrl] = cachedUrl;
            try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch (e) {}
        }

        async function shortenOnce(url) {
            const resp = await fetch(`${API_GATEWAY}?action=shorten&url=${encodeURIComponent(url)}`);
            if (!resp.ok) {
                const err = await resp.json();
                throw new Error(err.error || `HTTP ${resp.status}`);
            }
            const json = await resp.json();
            if (!json.success || !json.data || !json.data.shortenedUrl) {
                throw new Error('Worker trả về dữ liệu không hợp lệ');
            }
            return json.data.shortenedUrl;
        }

        async function shortenThrice(originalUrl) {
            const cache = getCache();
            if (cache[originalUrl]) {
                console.log(' Lấy từ cache (đã qua 3 lần):', cache[originalUrl]);
                return cache[originalUrl];
            }

            try {
                let currentUrl = originalUrl;
                console.log(`⏳ Lần 1: ${currentUrl}`);
                currentUrl = await shortenOnce(currentUrl);
                console.log(`   -> ${currentUrl}`);
                console.log(`⏳ Lần 2: ${currentUrl}`);
                currentUrl = await shortenOnce(currentUrl);
                console.log(`   -> ${currentUrl}`);
                console.log(`⏳ Lần 3: ${currentUrl}`);
                currentUrl = await shortenOnce(currentUrl);
                console.log(`   -> ${currentUrl}`);
                setCache(originalUrl, currentUrl);
                console.log(' Link cuối cùng:', currentUrl);
                return currentUrl;
            } catch (error) {
                console.error('❌ Lỗi vượt link, fallback về link gốc:', error);
                return originalUrl;
            }
        }