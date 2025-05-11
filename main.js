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
      header.classList.remove('hide-on-scroll');
    } 
    else if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
      header.classList.add('hide-on-scroll');
    } 
    else if (currentScroll < lastScroll) {
      header.classList.remove('hide-on-scroll');
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
function setupSearchForm() {
  const searchForm = document.getElementById('search-form');
  if (!searchForm) return;

  searchForm.addEventListener('submit', (e) => {
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
      document.querySelector('main').prepend(searchResults);
    }

    // Kiểm tra nếu có dữ liệu video
    if (typeof videoData === 'undefined') {
      searchResults.innerHTML = '<p class="text-center text-white text-lg">Dữ liệu video không tải được.</p>';
      return;
    }

    const results = videoData.filter(item => 
      (item.title && item.title.toLowerCase().includes(query)) || 
      (item.description && item.description.toLowerCase().includes(query))
    );

    if (results.length > 0) {
      searchResults.innerHTML = results.map(result => `
        <div class="search-result-item">
          <h3 class="text-lg font-bold text-sky-400">${result.title}</h3>
          <p class="text-white">${result.description || ''}</p>
          <div class="flex space-x-4 mt-2">
            <a href="video.html?id=${result.id}" class="btn-primary">Play</a>
            ${result.link ? `<a href="${result.link}" target="_blank" class="btn-primary">Link đề</a>` : ''}
          </div>
        </div>
      `).join('');
    } else {
      searchResults.innerHTML = '<p class="text-center text-white text-lg">Không tìm thấy kết quả.</p>';
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
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2, spaceBetween: 30 },
        1024: { slidesPerView: 3 }
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
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2, spaceBetween: 30 },
        1024: { slidesPerView: 3 }
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

// ============ XỬ LÝ TRANG CHI TIẾT KHÓA HỌC ============
function setupCourseDetailPage() {
  // Chỉ chạy trên trang chi tiết khóa học
  if (!document.querySelector('.course-detail')) return;

  let currentVideoState = {
    videoId: '',
    themeTitle: '',
    chapterTitle: '',
    videoType: 'main',
    isThemeSelected: false
  };

  // Tab switching
  const tabs = document.querySelectorAll('.tab-button');
  if (tabs.length) {
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        tabs.forEach(t => {
          t.classList.remove('text-blue-800', 'border-blue-800');
          t.classList.add('text-gray-500', 'border-transparent');
        });
        this.classList.remove('text-gray-500', 'border-transparent');
        this.classList.add('text-blue-800', 'border-blue-800');

        const targetId = this.getAttribute('data-target');
        document.querySelectorAll('.tab-content').forEach(content => {
          content.classList.toggle('hidden', content.id !== targetId);
        });
        
        if (targetId === 'description-content') {
          showIntroVideo();
        }
      });
    });

    tabs[0].click();
  }

  // Chapter toggle
  document.querySelectorAll('.chapter-toggle').forEach(toggle => {
    toggle.addEventListener('click', function() {
      const content = this.nextElementSibling;
      const icon = this.querySelector('i');
      
      content.classList.toggle('hidden');
      icon.classList.toggle('rotate-180');
      
      // Cập nhật chiều cao
      if (!content.classList.contains('hidden')) {
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = null;
      }
    });
  });

  // Video items
  document.querySelectorAll('.video-item').forEach(item => {
    item.addEventListener('click', function() {
      const videoId = this.getAttribute('data-video');
      const videoType = this.getAttribute('data-type');
      const themeItem = this.closest('.theme-item');
      const themeTitle = themeItem.querySelector('.theme-toggle').getAttribute('data-theme');
      const chapterTitle = themeItem.closest('.chapter-content').previousElementSibling
        .querySelector('.chapter-title').textContent;
      
      currentVideoState = { videoId, themeTitle, chapterTitle, videoType, isThemeSelected: true };
      changeVideo(currentVideoState);
    });
  });

  function showIntroVideo() {
    const videoIframe = document.getElementById('course-video');
    if (!videoIframe) return;

    videoIframe.src = `https://www.youtube.com/embed/LWw1GYTMvjQ?autoplay=1&rel=0&modestbranding=1&controls=1&fs=1&disablekb=1&iv_load_policy=3`;
    
    document.getElementById('course-title').textContent = 'ĐẠI SỐ';
    document.getElementById('chapter-theme-title')?.classList.add('hidden');
    document.getElementById('video-type-title')?.classList.add('hidden');
  }

  function changeVideo({ videoId, themeTitle, chapterTitle, videoType, isThemeSelected }) {
    const videoIframe = document.getElementById('course-video');
    const videoLoading = document.getElementById('video-loading');
    
    if (!videoIframe) return;

    videoLoading?.classList.remove('hidden');
    videoIframe.src = '';

    if (isThemeSelected) {
      document.getElementById('course-title').textContent = themeTitle;
      document.getElementById('chapter-theme-title').textContent = chapterTitle;
      document.getElementById('chapter-theme-title').classList.remove('hidden');
      
      const videoTypeTitle = document.getElementById('video-type-title');
      videoTypeTitle.textContent = videoType === 'main' ? 'Bài giảng chính' : 'Chữa bài tập rèn luyện';
      videoTypeTitle.classList.remove('hidden');
    }

    videoIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&controls=1&fs=1&disablekb=1&iv_load_policy=3`;
    
    videoIframe.onload = () => {
      videoLoading?.classList.add('hidden');
      if (isThemeSelected) {
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 300);
      }
    };
  }
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