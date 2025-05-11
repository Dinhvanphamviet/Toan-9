// ============ CÁC HÀM TIỆN ÍCH ============
function debounce(func, wait = 20) {
  let timeout;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  };
}

function isMobile() {
  return window.innerWidth < 768;
}

// ============ XỬ LÝ THEME TOGGLE ============
function setupThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  const darkIcon = document.getElementById('dark-icon');
  const lightIcon = document.getElementById('light-icon');

  // Kiểm tra theme từ localStorage hoặc thiết lập light mode làm mặc định
  if (!localStorage.getItem('theme')) {
    localStorage.setItem('theme', 'light'); // Thiết lập mặc định là light mode
  }

  // Áp dụng theme đã lưu
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
    darkIcon.classList.add('hidden');
    lightIcon.classList.remove('hidden');
  } else {
    document.body.classList.remove('light-mode');
    darkIcon.classList.remove('hidden');
    lightIcon.classList.add('hidden');
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLightMode = document.body.classList.contains('light-mode');
    
    // Đổi icon
    darkIcon.classList.toggle('hidden', isLightMode);
    lightIcon.classList.toggle('hidden', !isLightMode);
    
    // Lưu vào localStorage
    localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
    
    // Hiệu ứng toggle
    themeToggle.classList.add('toggling');
    setTimeout(() => themeToggle.classList.remove('toggling'), 300);
  });
}

// ============ XỬ LÝ HEADER SCROLL ============
function setupHeaderScroll() {
  const header = document.querySelector('header');
  if (!header) return;

  let lastScroll = 0;
  const scrollThreshold = 50;

  const handleScroll = debounce(() => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
      // Khi ở đầu trang - luôn hiện header
      header.classList.remove('hide-on-scroll');
    } 
    else if (currentScroll > lastScroll) {
      // Khi cuộn XUỐNG - ẩn header ngay khi vượt qua ngưỡng
      if (currentScroll > scrollThreshold) {
        header.classList.add('hide-on-scroll');
      }
    } 
    else {
      // Khi cuộn LÊN - chỉ hiện header khi lên tới đầu trang
      // (Không tự động hiện khi mới bắt đầu cuộn lên)
    }
    
    lastScroll = currentScroll;
  });

  window.addEventListener('scroll', handleScroll);
}


// ============ XỬ LÝ SCROLL TO TOP ============
function setupScrollToTop() {
  const scrollToTopBtn = document.getElementById('scroll-to-top');
  if (!scrollToTopBtn) return;

  // Hiển thị/ẩn nút khi cuộn
  window.addEventListener('scroll', () => {
    scrollToTopBtn.classList.toggle('visible', window.scrollY > 200);
  });

  // Xử lý click
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ============ XỬ LÝ MENU MOBILE ============
function setupMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('overlay');

  if (!hamburger || !mobileMenu) return;

  const toggleMenu = () => {
    mobileMenu.classList.toggle('open');
    overlay.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
    
    // Đổi icon
    const icon = hamburger.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
  };

  hamburger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);
  
  // Đóng menu khi click vào link
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', toggleMenu);
  });
}

// ============ XỬ LÝ SEARCH FORM ============
// ============ XỬ LÝ SEARCH FORM (FINAL VERSION) ============
function setupSearchForm() {
  const searchForm = document.getElementById('search-form');
  if (!searchForm) return;

  // Hàm mở chapter bằng tiêu đề
  function openChapterByTitle(title) {
    const chapters = document.querySelectorAll('.chapter-toggle');
    for (const chapter of chapters) {
      const chapterTitle = chapter.querySelector('.chapter-title');
      if (chapterTitle && chapterTitle.textContent.trim() === title.trim()) {
        if (chapter.nextElementSibling.classList.contains('hidden')) {
          chapter.click(); // Mở chapter nếu đang đóng
        }
        return chapter.nextElementSibling; // Trả về nội dung chapter
      }
    }
    return null;
  }

  // Hàm mở theme trong chapter
  function openThemeInChapter(chapterContent, themeTitle) {
    if (!chapterContent) return false;
    
    const themes = chapterContent.querySelectorAll('.theme-toggle');
    for (const theme of themes) {
      if (theme.getAttribute('data-theme').trim() === themeTitle.trim()) {
        if (theme.nextElementSibling.classList.contains('hidden')) {
          theme.click(); // Mở theme nếu đang đóng
        }
        // Cuộn mượt đến theme
        setTimeout(() => {
          theme.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
        return true;
      }
    }
    return false;
  }

  // Hàm lấy dữ liệu từ tất cả các trang
  async function fetchAllPagesData() {
    const pages = [
      'DaiSo.html',
      'HinhHoc.html',
      'ThongKeXacSuat.html',
      'TongOn.html',
      'GiaiDe.html'
    ];
    
    const allData = [];
    
    try {
      for (const page of pages) {
        const response = await fetch(page);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        
        // Lấy dữ liệu từ mỗi trang
        const themeItems = doc.querySelectorAll('.theme-item');
        
        themeItems.forEach(item => {
          const themeToggle = item.querySelector('.theme-toggle');
          const themeTitle = themeToggle.getAttribute('data-theme');
          const chapterTitle = item.closest('.chapter-content').previousElementSibling
                              .querySelector('.chapter-title').textContent;
          
          // Lấy video items
          item.querySelectorAll('.video-item').forEach(video => {
            allData.push({
              type: 'video',
              id: video.getAttribute('data-video'),
              title: video.getAttribute('data-title'),
              theme: themeTitle,
              chapter: chapterTitle,
              videoType: video.getAttribute('data-type'),
              page: doc.title
            });
          });
          
          // Lấy PDF items
          item.querySelectorAll('.pdf-item').forEach(pdf => {
            allData.push({
              type: 'pdf',
              url: pdf.getAttribute('href'),
              title: pdf.querySelector('span').textContent + ' (PDF)',
              theme: themeTitle,
              chapter: chapterTitle,
              page: doc.title
            });
          });
        });
      }
      return allData;
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
      return [];
    }
  }

  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = document.getElementById('search-input').value.trim().toLowerCase();
    let searchResults = document.getElementById('search-results');
    
    if (!query) {
      if (searchResults) searchResults.remove();
      return;
    }

    if (!searchResults) {
      searchResults = document.createElement('div');
      searchResults.id = 'search-results';
      searchResults.className = 'bg-white rounded-lg shadow-lg p-4 mt-4 max-h-[500px] overflow-y-auto';
      document.querySelector('main').prepend(searchResults);
    }

    // Hiển thị loading
    searchResults.innerHTML = `
      <div class="text-center py-4">
        <i class="fas fa-spinner fa-spin text-blue-500 text-xl"></i>
        <p class="mt-2 text-gray-600">Đang tìm kiếm...</p>
      </div>
    `;
    
    try {
      const allData = await fetchAllPagesData();
      const results = allData.filter(item => 
        (item.title && item.title.toLowerCase().includes(query)) || 
        (item.theme && item.theme.toLowerCase().includes(query)) ||
        (item.chapter && item.chapter.toLowerCase().includes(query))
      );

      if (results.length > 0) {
        searchResults.innerHTML = results.map(result => `
          <div class="search-result-item p-3 border-b border-gray-200 last:border-0 hover:bg-gray-100 transition">
            <div class="flex items-start">
              <div class="mr-3 pt-1">
                ${result.type === 'video' ? 
                  `<i class="fas ${result.videoType === 'main' ? 'fa-chalkboard-teacher text-green-500' : 'fa-tasks text-yellow-500'}"></i>` : 
                  `<i class="far fa-file-pdf text-red-500"></i>`}
              </div>
              <div class="flex-1">
                <h3 class="font-bold text-primary">${result.title}</h3>
                <p class="text-sm text-gray-600 mt-1">
                  <i class="fas fa-tag mr-1"></i>${result.theme}
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  <i class="fas fa-book mr-1"></i>${result.chapter} • ${result.page}
                </p>
                <div class="mt-3">
                  ${result.type === 'video' ? 
                    `<button class="play-video-btn px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-400 transition 
                      data-video="${result.id}" 
                      data-type="${result.videoType}" 
                      data-theme="${result.theme}" 
                      data-chapter="${result.chapter}">
                      <i class="fas fa-play mr-1"></i>Xem video
                    </button>` : 
                    `<a href="${result.url}" target="_blank" 
                      class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition">
                      <i class="fas fa-download mr-1"></i>Tải PDF
                    </a>`}
                </div>
              </div>
            </div>
          </div>
        `).join('');

        // Xử lý click nút xem video
        document.querySelectorAll('.play-video-btn').forEach(btn => {
          btn.addEventListener('click', async function() {
            const videoId = this.getAttribute('data-video');
            const videoType = this.getAttribute('data-type');
            const themeTitle = this.getAttribute('data-theme');
            const chapterTitle = this.getAttribute('data-chapter');
            
            // Đóng kết quả tìm kiếm
            searchResults.remove();
            
            // Chuyển sang tab curriculum nếu chưa
            if (document.getElementById('curriculum-content').classList.contains('hidden')) {
              document.getElementById('curriculum-tab').click();
              await new Promise(resolve => setTimeout(resolve, 300));
            }
            
            // Mở chapter tương ứng
            const chapterContent = openChapterByTitle(chapterTitle);
            if (chapterContent) {
              // Mở theme tương ứng
              const themeFound = openThemeInChapter(chapterContent, themeTitle);
              
              if (themeFound) {
                // Phát video sau khi mở xong
                setTimeout(() => {
                  changeVideo(videoId, themeTitle, chapterTitle, videoType, true);
                }, 500);
              }
            }
          });
        });
      } else {
        searchResults.innerHTML = `
          <div class="text-center py-6">
            <i class="far fa-frown text-gray-400 text-2xl"></i>
            <p class="mt-2 text-gray-600">Không tìm thấy kết quả phù hợp</p>
          </div>
        `;
      }
    } catch (error) {
      console.error('Lỗi tìm kiếm:', error);
      searchResults.innerHTML = `
        <div class="text-center py-6">
          <i class="fas fa-exclamation-triangle text-red-400 text-2xl"></i>
          <p class="mt-2 text-red-500">Có lỗi xảy ra khi tìm kiếm</p>
          <button class="mt-3 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300" 
            onclick="setupSearchForm()">
            <i class="fas fa-sync-alt mr-1"></i>Thử lại
          </button>
        </div>
      `;
    }
  });

  // Xử lý khi xóa nội dung tìm kiếm
  document.getElementById('search-input').addEventListener('input', (e) => {
    if (e.target.value.trim() === '') {
      const searchResults = document.getElementById('search-results');
      if (searchResults) searchResults.remove();
    }
  });
}

// ============ XỬ LÝ SLIDER ============
function setupSliders() {
  // Image slider
  const imageSlider = document.getElementById('image-slider');
  if (imageSlider) {
    const slides = imageSlider.querySelectorAll('[data-slide]');
    const dots = document.querySelectorAll('.slider-dot');
    let currentSlide = 1;
    const totalSlides = slides.length;

    const showSlide = (n) => {
      slides.forEach(slide => slide.style.opacity = '0');
      dots.forEach(dot => dot.classList.remove('active'));
      
      slides[n-1].style.opacity = '1';
      dots[n-1].classList.add('active');
      currentSlide = n;
    };

    let slideInterval = setInterval(() => {
      currentSlide = currentSlide % totalSlides + 1;
      showSlide(currentSlide);
    }, 3000);

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        clearInterval(slideInterval);
        showSlide(parseInt(dot.getAttribute('data-slide')));
        slideInterval = setInterval(() => {
          currentSlide = currentSlide % totalSlides + 1;
          showSlide(currentSlide);
        }, 3000);
      });
    });

    showSlide(1);
  }

  // Swiper sliders
  if (typeof Swiper !== 'undefined') {
    const daisoSlider = new Swiper('.daiso-slider', {
      loop: true,
      autoplay: { delay: 3000 },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: { el: '.swiper-pagination', clickable: true },
      breakpoints: {
        640: { slidesPerView: 1, spaceBetween: 10 },
        768: { slidesPerView: 2, spaceBetween: 30 },
        1024: { slidesPerView: 3, spaceBetween: 15 }
      }
    });

    const hinhhocSlider = new Swiper('.hinhhoc-slider', {
      loop: true,
      autoplay: { delay: 2500, reverseDirection: true },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: { el: '.swiper-pagination', clickable: true },
      breakpoints: {
        640: { slidesPerView: 1, spaceBetween: 10 },
        768: { slidesPerView: 2, spaceBetween: 30 },
        1024: { slidesPerView: 3, spaceBetween: 15 }
      }
    });
  }
}

// ============ XỬ LÝ COUNTDOWN ============
function setupCountdown() {
  const examDate = new Date('2025-06-07T08:00:00');
  const countdownElements = {
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds')
  };

  if (!countdownElements.days) return;

  const updateCountdown = () => {
    const diff = examDate - new Date();
    
    if (diff <= 0) {
      Object.values(countdownElements).forEach(el => el.textContent = '00');
      return;
    }

    countdownElements.days.textContent = Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
    countdownElements.hours.textContent = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
    countdownElements.minutes.textContent = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    countdownElements.seconds.textContent = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ============ KHỞI TẠO KHI TRANG TẢI XONG ============
document.addEventListener('DOMContentLoaded', function() {
  // Các hàm chung
  setupThemeToggle();
  setupHeaderScroll();
  setupScrollToTop();
  setupMobileMenu();
  setupSearchForm();
  setupSliders();
  setupCountdown();
  
  // Các hàm riêng cho trang chi tiết
  setupCourseDetailPage();
  
  // Animation
  const animateElements = document.querySelectorAll('section, .video-item, footer');
  animateElements.forEach(el => {
    el.classList.add('animate__animated', 'animate__fadeIn');
  });
});

document.addEventListener('DOMContentLoaded', function() {
  // Lấy nút "Học Ngay" (sử dụng selector chính xác hơn)
  const hocNgayBtn = document.querySelector('button.bg-blue-500.hover\\:bg-blue-700.text-white.font-bold.py-3.px-6.rounded-full');
  
  if (hocNgayBtn) {
    hocNgayBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // 1. Thêm hiệu ứng nhấn nút
      this.classList.add('animate-click');
      setTimeout(() => this.classList.remove('animate-click'), 200);
      
      // 2. Chuyển sang tab Đề cương nếu chưa active
      const curriculumTab = document.getElementById('curriculum-tab');
      const descriptionTab = document.getElementById('description-tab');
      
      if (curriculumTab && !curriculumTab.classList.contains('text-blue-800')) {
        // Kích hoạt tab Đề cương
        curriculumTab.classList.remove('text-gray-500', 'border-transparent');
        curriculumTab.classList.add('text-blue-800', 'border-blue-800');
        
        descriptionTab.classList.remove('text-blue-800', 'border-blue-800');
        descriptionTab.classList.add('text-gray-500', 'border-transparent');
        
        // Ẩn nội dung mô tả, hiện nội dung đề cương
        document.getElementById('description-content').classList.add('hidden');
        document.getElementById('curriculum-content').classList.remove('hidden');
      }
      
      // 3. Cuộn lên đầu trang trước
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      // 4. Sau đó cuộn đến phần đề cương (với delay nhỏ)
      setTimeout(() => {
        const deCuongSection = document.getElementById('curriculum-content');
        if (deCuongSection) {
          deCuongSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Thêm hiệu ứng highlight
          deCuongSection.style.transition = 'all 0.5s ease';
          deCuongSection.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.5)';
          setTimeout(() => {
            deCuongSection.style.boxShadow = 'none';
          }, 2000);
        }
      }, 500); // Delay để đảm bảo cuộn lên đầu trang hoàn tất
    });
  }
});