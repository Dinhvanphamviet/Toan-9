// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
  // Tab switching functionality
  const tabs = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  const videoTypeSelector = document.querySelector('.flex.border-b');

  // Add click event listeners to each tab
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Reset styles for all tabs
      tabs.forEach(t => {
        t.classList.remove('text-blue-800', 'border-blue-800');
        t.classList.add('text-gray-500', 'border-transparent');
      });

      // Highlight the clicked tab
      this.classList.remove('text-gray-500', 'border-transparent');
      this.classList.add('text-blue-800', 'border-blue-800');

      // Hide all tab contents
      tabContents.forEach(content => {
        content.classList.add('hidden');
      });

      // Show the content corresponding to the clicked tab
      const targetId = this.getAttribute('data-target');
      document.getElementById(targetId).classList.remove('hidden');
      
      // Hide the video type selector and show the intro video
      videoTypeSelector.classList.add('hidden');
      showIntroVideo();
    });
  });

  // Function to show the intro video
  function showIntroVideo() {
    videoIframe.src = `https://www.youtube.com/embed/LWw1GYTMvjQ?autoplay=1&rel=0&modestbranding=1&controls=1&fs=1&disablekb=1&iv_load_policy=3`;
    document.getElementById('course-title').textContent = 'ĐẠI SỐ';
    document.getElementById('chapter-theme-title').classList.add('hidden');
    document.getElementById('video-type-title').classList.add('hidden');
  }

  // Function to update chapter height with smooth transition
  function updateChapterHeight(chapterContent) {
    if (chapterContent) {
      // Temporarily remove transition for instant height calculation
      chapterContent.style.transition = 'none';
      chapterContent.style.maxHeight = chapterContent.scrollHeight + 'px';
      
      // Restore transition after height is set
      setTimeout(() => {
        chapterContent.style.transition = 'max-height 0.3s ease-out';
      }, 10);
    }
  }

  // Chapter toggle functionality with improved animation
  const chapterToggles = document.querySelectorAll('.chapter-toggle');
  chapterToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const content = this.nextElementSibling;
      const icon = this.querySelector('i');
      
      // Toggle content with smooth animation
      if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.classList.add('rotate-180');
        updateChapterHeight(content);
      } else {
        content.style.maxHeight = null;
        setTimeout(() => {
          content.classList.add('hidden');
        }, 300); // Match this with CSS transition duration
        icon.classList.remove('rotate-180');
      }
    });
  });

  // Theme toggle functionality
  const themeToggles = document.querySelectorAll('.theme-toggle');
  const videoIframe = document.getElementById('course-video');
  const videoLoading = document.getElementById('video-loading');
  const headerOffset = 100;
  const mainLessonBtn = document.getElementById('main-lesson-btn');
  const exerciseBtn = document.getElementById('exercise-btn');
  const videoTypeTitle = document.getElementById('video-type-title');
  
  // Object to store the current video state
  let currentVideoState = {
    videoId: '',
    themeTitle: '',
    chapterTitle: '',
    videoType: 'main',
    isThemeSelected: false
  };
  
  // Function to expand the parent chapter of a theme
  function expandParentChapter(themeElement) {
    const chapterContent = themeElement.closest('.chapter-content');
    if (chapterContent && chapterContent.classList.contains('hidden')) {
      const chapterToggle = chapterContent.previousElementSibling;
      chapterContent.classList.remove('hidden');
      chapterToggle.querySelector('i').classList.add('rotate-180');
      updateChapterHeight(chapterContent);
    }
  }
  
  // Function to change the video
  function changeVideo(videoId, themeTitle, chapterTitle, videoType, isThemeSelected) {
    try {
      // Show loading indicator and reset video iframe
      videoLoading.classList.remove('hidden');
      videoIframe.src = '';
      
      // Update the current video state
      currentVideoState = {
        videoId,
        themeTitle,
        chapterTitle,
        videoType,
        isThemeSelected
      };
      
      // Update UI based on whether a theme is selected
      if (isThemeSelected) {
        videoTypeSelector.classList.remove('hidden');
        updateVideoTypeUI(videoType);
        
        document.getElementById('course-title').textContent = themeTitle;
        const chapterThemeTitle = document.getElementById('chapter-theme-title');
        chapterThemeTitle.textContent = chapterTitle;
        chapterThemeTitle.classList.remove('hidden');
        
        videoTypeTitle.textContent = videoType === 'main' ? 'Bài giảng chính' : 'Chữa bài tập rèn luyện';
        videoTypeTitle.classList.remove('hidden');
      } else {
        videoTypeSelector.classList.add('hidden');
        document.getElementById('chapter-theme-title').classList.add('hidden');
        document.getElementById('video-type-title').classList.add('hidden');
      }
      
      // Set the video iframe source
      videoIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&controls=1&fs=1&disablekb=1&iv_load_policy=3`;
      
      // Hide loading indicator once the video is loaded
      videoIframe.onload = function() {
        videoLoading.classList.add('hidden');
        if (isThemeSelected) {
          setTimeout(() => {
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }, 300);
        }
      };
    } catch (error) {
      console.error('Error changing video:', error);
      videoLoading.classList.add('hidden');
    }
  }
  
  // Function to update the video type UI
  function updateVideoTypeUI(videoType) {
    if (videoType === 'main') {
      mainLessonBtn.classList.add('active');
      exerciseBtn.classList.remove('active');
    } else {
      mainLessonBtn.classList.remove('active');
      exerciseBtn.classList.add('active');
    }
  }
  
  // Improved theme toggle events with better chapter height handling
  themeToggles.forEach(toggle => {
    if (toggle.id !== 'theme-toggle') {
      toggle.addEventListener('click', function(event) {
        const clickedElement = event.target;
        const themeItem = this.closest('.theme-item');
        const detail = themeItem.querySelector('.theme-detail');
        const icon = this.querySelector('i');
        const chapterContent = themeItem.closest('.chapter-content');
        
        // Expand parent chapter if needed
        expandParentChapter(themeItem);
        
        if (clickedElement === this || clickedElement.closest('span') === this.querySelector('span')) {
          const themeTitle = this.getAttribute('data-theme');
          const chapterTitle = this.closest('.chapter-content').previousElementSibling.querySelector('.chapter-title').textContent;
          
          const mainVideoItem = themeItem.querySelector('.video-item[data-type="main"]');
          if (mainVideoItem) {
            const videoId = mainVideoItem.getAttribute('data-video');
            
            // First expand the theme detail
            if (detail.classList.contains('hidden')) {
              detail.classList.remove('hidden');
              icon.classList.add('rotate-180');
              detail.style.maxHeight = detail.scrollHeight + 'px';
              
              // Update chapter height after detail is expanded
              updateChapterHeight(chapterContent);
              
              setTimeout(() => {
                changeVideo(videoId, themeTitle, chapterTitle, 'main', true);
              }, 100);
            } else {
              // If already expanded, just change the video
              changeVideo(videoId, themeTitle, chapterTitle, 'main', true);
            }
          }
        } else {
          // Toggle theme detail
          if (detail.classList.contains('hidden')) {
            detail.classList.remove('hidden');
            icon.classList.add('rotate-180');
            detail.style.maxHeight = detail.scrollHeight + 'px';
            
            // Update chapter height after detail is expanded
            updateChapterHeight(chapterContent);
            
            setTimeout(() => {
              const elementPosition = this.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              });
            }, 100);
          } else {
            detail.style.maxHeight = null;
            setTimeout(() => {
              detail.classList.add('hidden');
              icon.classList.remove('rotate-180');
              updateChapterHeight(chapterContent);
            }, 300);
          }
        }
      });
    }
  });
  
  // Video item click handler with smooth expansion
  document.querySelectorAll('.video-item').forEach(item => {
    item.addEventListener('click', function() {
      const videoId = this.getAttribute('data-video');
      const videoType = this.getAttribute('data-type');
      const themeItem = this.closest('.theme-item');
      const themeTitle = themeItem.querySelector('.theme-toggle').getAttribute('data-theme');
      const chapterTitle = themeItem.closest('.chapter-content').previousElementSibling.querySelector('.chapter-title').textContent;
      const chapterContent = themeItem.closest('.chapter-content');
      const detail = themeItem.querySelector('.theme-detail');
      
      // Ensure parent chapter is expanded
      if (chapterContent.classList.contains('hidden')) {
        chapterContent.classList.remove('hidden');
        chapterContent.previousElementSibling.querySelector('i').classList.add('rotate-180');
        updateChapterHeight(chapterContent);
      }
      
      // Ensure theme detail is expanded
      if (detail.classList.contains('hidden')) {
        detail.classList.remove('hidden');
        themeItem.querySelector('.theme-toggle i').classList.add('rotate-180');
        detail.style.maxHeight = detail.scrollHeight + 'px';
        updateChapterHeight(chapterContent);
      }
      
      changeVideo(videoId, themeTitle, chapterTitle, videoType, true);
    });
  });
  
  // Handle main lesson button click
  mainLessonBtn.addEventListener('click', function() {
    if (currentVideoState.videoId && currentVideoState.isThemeSelected) {
      const currentTheme = document.querySelector(`.theme-toggle[data-theme="${currentVideoState.themeTitle}"]`);
      if (currentTheme) {
        const themeItem = currentTheme.closest('.theme-item');
        const mainVideoItem = themeItem.querySelector('.video-item[data-type="main"]');
        if (mainVideoItem) {
          const videoId = mainVideoItem.getAttribute('data-video');
          changeVideo(videoId, currentVideoState.themeTitle, currentVideoState.chapterTitle, 'main', true);
        }
      }
    }
  });
  
  // Handle exercise button click
  exerciseBtn.addEventListener('click', function() {
    if (currentVideoState.videoId && currentVideoState.isThemeSelected) {
      const currentTheme = document.querySelector(`.theme-toggle[data-theme="${currentVideoState.themeTitle}"]`);
      if (currentTheme) {
        const themeItem = currentTheme.closest('.theme-item');
        const exerciseVideoItem = themeItem.querySelector('.video-item[data-type="exercise"]');
        if (exerciseVideoItem) {
          const videoId = exerciseVideoItem.getAttribute('data-video');
          changeVideo(videoId, currentVideoState.themeTitle, currentVideoState.chapterTitle, 'exercise', true);
        }
      }
    }
  });
  
  // Activate the first tab by default
  document.getElementById('description-tab').click();
  videoTypeSelector.classList.add('hidden');
  
  // Initialize first chapter and theme
  const firstChapter = document.querySelector('.chapter-content');
  if (firstChapter) {
    // Don't expand first chapter by default
    firstChapter.classList.add('hidden');
    firstChapter.style.maxHeight = null;
    document.querySelector('.chapter-toggle i').classList.remove('rotate-180');
  }
  
  // Show the intro video
  showIntroVideo();
});

// ============ CÁC HÀM TIỆN ÍCH ============
