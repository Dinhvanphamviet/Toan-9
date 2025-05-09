const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

// Danh sách các tệp HTML cần xử lý
const htmlFiles = [
    'index.html',
    'videodaiso.html',
    'videohinhhoc.html',
    'videothongkexacsuat.html',
    'videotongon.html',
    'videogiaide.html'
];

// Hàm trích xuất dữ liệu video từ index.html (dựa vào .video-item)
function extractVideosFromIndex(filePath) {
    const html = fs.readFileSync(filePath, 'utf-8');
    const $ = cheerio.load(html);
    const videos = [];

    $('.video-item').each((index, element) => {
        const titleElement = $(element).find('h3');
        const descriptionElement = $(element).find('p');
        const playLinkElement = $(element).find('a:contains("Play")');
        const fileLinkElement = $(element).find('a:contains("Link đề")');

        const title = titleElement.text().trim();
        const description = descriptionElement.text().trim() || '';
        const playLink = playLinkElement.attr('href') || '';
        const videoId = playLink.includes('id=') ? playLink.split('id=')[1] : '';
        const fileLink = fileLinkElement.attr('href') || '';

        if (title && videoId) {
            videos.push({
                page: path.basename(filePath, '.html'),
                title: title,
                description: description,
                id: videoId,
                link: fileLink
            });
        }
    });

    return videos;
}

// Hàm trích xuất dữ liệu video từ các trang video (dựa vào videoList trong script)
function extractVideosFromVideoPage(filePath) {
    const html = fs.readFileSync(filePath, 'utf-8');
    const $ = cheerio.load(html);
    const videos = [];

    // Lấy nội dung script chứa videoList
    const scriptContent = $('script').text();
    const videoListMatch = scriptContent.match(/const\s+videoList\s*=\s*\[(.*?)\];/s);

    if (videoListMatch) {
        try {
            // Lấy phần nội dung bên trong mảng videoList
            const videoListStr = videoListMatch[1].trim();
            // Tách từng phần tử của mảng bằng cách tìm các dấu { và }
            const videoItems = [];
            let currentItem = '';
            let braceCount = 0;
            let inString = false;
            let stringChar = null;

            // Phân tích thủ công từng ký tự để xử lý đúng cú pháp
            for (let i = 0; i < videoListStr.length; i++) {
                const char = videoListStr[i];

                // Xử lý chuỗi ký tự (string)
                if ((char === '"' || char === "'") && videoListStr[i - 1] !== '\\') {
                    if (!inString) {
                        inString = true;
                        stringChar = char;
                    } else if (char === stringChar) {
                        inString = false;
                        stringChar = null;
                    }
                }

                // Đếm dấu ngoặc { và } để xác định ranh giới của từng object
                if (!inString) {
                    if (char === '{') {
                        braceCount++;
                    } else if (char === '}') {
                        braceCount--;
                    }
                }

                currentItem += char;

                // Khi braceCount về 0 và không trong string, đây là một object hoàn chỉnh
                if (braceCount === 0 && !inString && currentItem.trim() !== '') {
                    videoItems.push(currentItem.trim());
                    currentItem = '';
                }
            }

            // Chuyển từng phần tử thành object
            videoItems.forEach(item => {
                try {
                    // Loại bỏ dấu , ở cuối nếu có
                    item = item.replace(/,\s*$/, '');
                    if (!item) return;

                    const idMatch = item.match(/id:\s*['"]([^'"]+)['"]/);
                    const titleMatch = item.match(/title:\s*['"]([^'"]+)['"]/);
                    const descMatch = item.match(/desc:\s*['"]([^'"]+)['"]/);

                    const videoId = idMatch ? idMatch[1] : '';
                    const title = titleMatch ? titleMatch[1] : '';
                    const description = descMatch ? descMatch[1] : '';

                    if (title && videoId) {
                        videos.push({
                            page: path.basename(filePath, '.html'),
                            title: title,
                            description: description,
                            id: videoId,
                            link: '' // Không có link đề trong videoList
                        });
                    }
                } catch (e) {
                    console.error(`Lỗi phân tích một mục trong videoList (${filePath}):`, item, e);
                }
            });
        } catch (e) {
            console.error(`Lỗi phân tích videoList trong ${filePath}:`, e);
        }
    }

    return videos;
}

// Thu thập dữ liệu từ tất cả các tệp
let allVideos = [];
htmlFiles.forEach(file => {
    try {
        const filePath = path.join(__dirname, file);
        if (fs.existsSync(filePath)) {
            let videos = [];
            if (file === 'index.html') {
                videos = extractVideosFromIndex(filePath);
            } else {
                videos = extractVideosFromVideoPage(filePath);
            }
            allVideos = allVideos.concat(videos);
            console.log(`Đã xử lý ${file}: ${videos.length} video được tìm thấy.`);
        } else {
            console.warn(`Tệp ${file} không tồn tại.`);
        }
    } catch (error) {
        console.error(`Lỗi khi xử lý ${file}:`, error);
    }
});

// Tạo nội dung cho videos.js
const jsContent = `const videoData = ${JSON.stringify(allVideos, null, 2)};\n`;

// Ghi vào tệp videos.js
fs.writeFileSync('videos.js', jsContent, 'utf-8');
console.log('Tệp videos.js đã được tạo thành công!');