// 1. Anlık CSRF token'ı al
const csrfToken = $x("//*[@name='csrf_token']")[0]?.getAttribute("value");

// 2. Tablo satırlarının ilk hücrelerinden ID'leri topla
const ids = Array.from(document.querySelectorAll("tbody tr"))
  .map(tr => parseInt(tr.querySelector("td")?.innerText.trim()))
  .filter(id => !isNaN(id)); // Sadece geçerli sayılar

// 3. Alan adını otomatik al
const origin = location.origin;

// 4. Her ID için fetch işlemi yap
ids.forEach(id => {
  fetch(`${origin}/Rss/checkFeedPosts`, {
    method: "POST",
    headers: {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
      "cache-control": "max-age=0",
      "content-type": "application/x-www-form-urlencoded",
      "priority": "u=0, i",
      "sec-ch-ua": "\"Chromium\";v=\"134\", \"Not:A-Brand\";v=\"24\", \"Google Chrome\";v=\"134\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1"
    },
    referrer: `${origin}/admin/feeds`,
    referrerPolicy: "strict-origin-when-cross-origin",
    body: `csrf_token=${csrfToken}&id=${id}&back_url=${encodeURIComponent(origin + "/admin/feeds")}`,
    mode: "cors",
    credentials: "include"
  })
  .then(response => {
    if (!response.ok) throw new Error(`ID ${id} için hata: ${response.status}`);
    console.log(`ID ${id} başarılı`);
  })
  .catch(error => console.error(error));
});
