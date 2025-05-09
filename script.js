// Kiểm tra nếu đã có chế độ sáng được lưu trong localStorage
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
    document.getElementById('theme-toggle').innerHTML = '<i class="fas fa-sun"></i>';
}

// Xử lý sự kiện khi nhấn nút chuyển đổi chủ đề
document.getElementById('theme-toggle').addEventListener('click', () => {
    const toggleBtn = document.getElementById('theme-toggle');
    toggleBtn.classList.add('toggling');
    setTimeout(() => toggleBtn.classList.remove('toggling'), 300);
    document.body.classList.toggle('light-mode');
    const isLightMode = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
    document.getElementById('theme-toggle').innerHTML = isLightMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

// Xử lý sự kiện khi nhấn nút cuộn lên đầu trang
document.getElementById('scroll-to-top').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Hiển thị/ẩn nút cuộn lên đầu trang khi cuộn
window.addEventListener('scroll', () => {
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    if (window.scrollY > 200) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

// Hiệu ứng cuộn hiển thị với IntersectionObserver
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section, .video-item, footer');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', entry.target.classList.contains('video-item') ? 'animate__fadeInUp' : 'animate__fadeIn');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => observer.observe(section));
});

document.getElementById('search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const query = document.getElementById('search-input').value.trim().toLowerCase();
    let searchResults = document.getElementById('search-results');
    
    // Tạo vùng hiển thị kết quả nếu chưa có
    if (!searchResults) {
        searchResults = document.createElement('div');
        searchResults.id = 'search-results';
        document.querySelector('main').insertBefore(searchResults, document.querySelector('main').firstChild);
    }

    // Kiểm tra nếu không nhập gì
    if (!query) {
        searchResults.innerHTML = '<p class="text-center text-white text-lg">Không tìm thấy kết quả phù hợp.</p>';
        return;
    }

    // Kiểm tra nếu videoData tồn tại
    if (typeof videoData === 'undefined' || !Array.isArray(videoData)) {
        searchResults.innerHTML = '<p class="text-center text-white text-lg">Dữ liệu video không tải được. Vui lòng kiểm tra tệp videos.js.</p>';
        console.error('videoData không tồn tại hoặc không phải là mảng:', typeof videoData, videoData);
        return;
    }

    // Lọc kết quả dựa trên title và description
    const results = videoData.filter(item => {
        const titleMatch = item.title && item.title.toLowerCase().includes(query);
        const descMatch = item.description && item.description.toLowerCase().includes(query);
        return titleMatch || descMatch;
    });

    // Hiển thị kết quả
    searchResults.innerHTML = '';

    if (results.length > 0) {
        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <h3 class="text-lg font-bold text-sky-400">${result.title}</h3>
                <p class="text-white">${result.description || ''}</p>
                <div class="flex space-x-4 mt-2">
                    <a href="video.html?id=${result.id}" class="px-6 py-3 border-4 border-sky-400 text-white font-bold rounded-lg shadow-lg hover:bg-sky-400 hover:text-gray-900 transition-all duration-300 transform hover:scale-105 btn-pulse">Play</a>
                    ${result.link ? `<a href="${result.link}" target="_blank" class="px-6 py-3 border-4 border-sky-400 text-white font-bold rounded-lg shadow-lg hover:bg-sky-400 hover:text-gray-900 transition-all duration-300 transform hover:scale-105 btn-pulse">Link đề</a>` : ''}
                </div>
            `;
            searchResults.appendChild(resultItem);
        });
    } else {
        searchResults.innerHTML = '<p class="text-center text-white text-lg">Không tìm thấy kết quả phù hợp.</p>';
    }
});

// Reset khi xóa nội dung tìm kiếm
document.getElementById('search-input').addEventListener('input', (e) => {
    const searchResults = document.getElementById('search-results');
    if (e.target.value.trim() === '') {
        if (searchResults) {
            searchResults.remove();
        }
    }
});

// Debug: Kiểm tra videoData khi trang tải
document.addEventListener('DOMContentLoaded', () => {
    if (typeof videoData === 'undefined') {
        console.error('videoData không được định nghĩa. Kiểm tra tệp videos.js.');
    } else {
        console.log('videoData đã tải thành công:', videoData);
    }
});

// Slider functionality
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('image-slider');
    const slides = slider.querySelectorAll('[data-slide]');
    const dots = document.querySelectorAll('.slider-dot');
    let currentSlide = 1;
    const totalSlides = slides.length;

    // Function to show slide
    function showSlide(n) {
        slides.forEach(slide => {
            slide.style.opacity = '0';
        });
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        slides[n-1].style.opacity = '1';
        dots[n-1].classList.add('active');
        currentSlide = n;
    }

    // Auto slide change every 3 seconds
    let slideInterval = setInterval(() => {
        currentSlide = currentSlide % totalSlides + 1;
        showSlide(currentSlide);
    }, 3000);

    // Dot click event
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            clearInterval(slideInterval);
            const slideNum = parseInt(this.getAttribute('data-slide'));
            showSlide(slideNum);
            
            // Restart auto slide
            slideInterval = setInterval(() => {
                currentSlide = currentSlide % totalSlides + 1;
                showSlide(currentSlide);
            }, 3000);
        });
    });

    // Initial show first slide
    showSlide(1);
});


//Dếm ngược đến ngày thi
//07/06/2025 8h sáng
const examDate = new Date('2025-06-07T00:00:00');

function updateCountdown() {
  const now = new Date();
  const diff = examDate - now;
  
  // Tính toán ngày, giờ, phút, giây
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  // Hiển thị
  document.getElementById('days').textContent = days.toString().padStart(2, '0');
  document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
  document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
  document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
  
  // Dừng đếm khi thời gian kết thúc
  if (diff < 0) {
    clearInterval(countdownInterval);
    document.querySelectorAll('#days, #hours, #minutes, #seconds').forEach(el => {
      el.textContent = '00';
    });
  }
}

// Cập nhật mỗi giây
const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown(); // Chạy ngay lần đầu


 // Khởi tạo slider BON 2025
 const DaisoSlider = new Swiper('.daiso-slider', {
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        640: { slidesPerView: 1, spaceBetween: 20 },
        768: { slidesPerView: 2, spaceBetween: 30 },
        1024: { slidesPerView: 3, spaceBetween: 20 },
    }
});

// Khởi tạo slider BON 2026
const HinhhocSlider = new Swiper('.hinhhoc-slider', {
    loop: true,
    autoplay: {
        delay: 2500,
        reverseDirection: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        640: { slidesPerView: 1, spaceBetween: 20 },
        768: { slidesPerView: 2, spaceBetween: 30 },
        1024: { slidesPerView: 3, spaceBetween: 20 },
    }
});