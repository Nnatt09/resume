document.addEventListener("DOMContentLoaded", function () {
  // cursor animation
  const cursor = document.querySelector(".cursor");
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  const speed = 0.1; // Lower value = more lag, making it feel "further behind"
  let timeout;

  // The animation loop that creates the lagging effect
  function animateCursor() {
    // Calculate the distance between the cursor's current position and the mouse's position
    const distX = mouseX - cursorX;
    const distY = mouseY - cursorY;

    // Move the cursor a fraction of the distance. This creates the smooth lag.
    cursorX += distX * speed;
    cursorY += distY * speed;

    cursor.style.left = cursorX + "px";
    cursor.style.top = cursorY + "px";

    // Continue the animation on the next frame
    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  // Update the target mouse position and handle cursor visibility
  document.addEventListener("mousemove", function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.display = "block";

    // Reset the timer that hides the cursor when it's inactive
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cursor.style.display = "none";
    }, 1000); // Hide after 1 second of inactivity
  });

  // Hide the cursor when the mouse leaves the window
  document.addEventListener("mouseout", function () {
    cursor.style.display = "none";
  });

  // --- Side Navigation Visibility ---
  const sideNav = document.querySelector(".header");
    const aboutSection = document.querySelector('#about');

    // Ensure the elements exist before proceeding
    if (!sideNav || !aboutSection) {
      console.error("Side navigation or About section not found.");
      return;
    }

    const nav_observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // If the 'about' section is intersecting (visible on screen)
        if (entry.isIntersecting) {
          // Hide the side navigation
          sideNav.classList.remove('visible');
        } else {
          // When scrolling away from the 'about' section, show the navigation
          sideNav.classList.add('visible');
        }
      });
    }, { threshold: 0.1 }); // Trigger when 10% of the about section is visible
    nav_observer.observe(aboutSection);

  // --- Skills Tabs ---
  const tabs = document.querySelectorAll(".skill-tab");
  const skillContents = document.querySelectorAll(".skill-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", function (e) {
      e.preventDefault();
      tabs.forEach((t) => t.classList.remove("active-tab"));
      skillContents.forEach((c) => c.classList.remove("active-content"));
      this.classList.add("active-tab");
      document.getElementById(this.getAttribute("data-content")).classList.add("active-content");
    });
  });

  
  // --- Experience Tabs ---
  const expTabs = document.querySelectorAll(".exp-tab");
  const expContents = document.querySelectorAll(".exp-content");

  expTabs.forEach((tab) => {
    tab.addEventListener("click", function (e) {
      e.preventDefault();
      expTabs.forEach((t) => t.classList.remove("active-tab"));
      expContents.forEach((c) => c.classList.remove("active-content"));
      this.classList.add("active-tab");
      document.getElementById(this.getAttribute("data-content")).classList.add("active-content");
    });
  });

  // --- Intersection Observer for animations ---
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".timeline-content, .work-exp").forEach((el) => {
    observer.observe(el);
  });

  // --- Work Experience Slideshows ---
  document.querySelectorAll(".work-title").forEach((title) => {
    const slides = title.querySelectorAll(".work-slide");
    if (slides.length === 0) return;

    let currentWorkSlide = 0;
    let workSlideInterval;

    const showWorkSlide = (index) => {
      slides.forEach((slide, i) => (slide.style.opacity = i === index ? 1 : 0));
    };

    const nextWorkSlide = () => {
      currentWorkSlide = (currentWorkSlide + 1) % slides.length;
      showWorkSlide(currentWorkSlide);
    };

    title.addEventListener("mouseenter", () => {
      showWorkSlide(0);
      workSlideInterval = setInterval(nextWorkSlide, 2000);
    });

    title.addEventListener("mouseleave", () => {
      clearInterval(workSlideInterval);
      slides.forEach((slide) => (slide.style.opacity = 0));
      currentWorkSlide = 0;
    });
  });

  // --- Service/Volunteering Image Animation on Hover ---
  document.querySelectorAll('.sticky-element').forEach(stickyElement => {
    const titles = stickyElement.querySelectorAll('.service-desc h5');

    titles.forEach(title => {
        let currentEl = title.nextElementSibling;
        let imageContainer = null;

        // Find the next sibling which is the image container
        while(currentEl) {
            if (currentEl.classList.contains('service-images')) {
                imageContainer = currentEl;
                break;
            }
            // Stop if we hit the next h5
            if (currentEl.tagName === 'H5') {
                break;
            }
            currentEl = currentEl.nextElementSibling;
        }

        if (imageContainer) {
            const images = imageContainer.querySelectorAll('img');
            if (images.length > 0) {
                title.addEventListener('mouseenter', () => {
                    // Hide other shown containers in the same sticky element
                    stickyElement.querySelectorAll('.service-images.show').forEach(shownContainer => {
                        if (shownContainer !== imageContainer) {
                            shownContainer.classList.remove('show');
                        }
                    });

                    // Show the current container to create space
                    imageContainer.classList.add('show');

                    // Animate images inside
                    images.forEach((img, index) => {
                        setTimeout(() => { img.classList.add('fly-up'); }, index * 150);
                    });
                });
            }
        }
    });

    // Reset when mouse leaves the entire sticky element
    stickyElement.addEventListener('mouseleave', () => {
        stickyElement.querySelectorAll('.service-images').forEach(container => {
            container.classList.remove('show');
            container.querySelectorAll('img').forEach(img => {
                img.classList.remove('fly-up');
            });
        });
    });
  });

  // --- Awards Section Interactivity ---
  let awardSlideIndex = 1;
  let awardSlideshowTimeout;
  const awardSlides = document.querySelectorAll(".award-slide");
  const awardList = document.querySelector(".awards-list");

  function showAwardSlides(n) {
    if (n > awardSlides.length) awardSlideIndex = 1;
    if (n < 1) awardSlideIndex = awardSlides.length;
    awardSlides.forEach((slide) => (slide.style.display = "none"));
    if (awardSlides.length > 0) {
      awardSlides[awardSlideIndex - 1].style.display = "block";
    }
  }

  function autoAwardSlideshow() {
    awardSlideshowTimeout = setTimeout(() => {
      showAwardSlides(++awardSlideIndex);
      autoAwardSlideshow();
    }, 3000);
  }

  if (awardSlides.length > 0) {
    showAwardSlides(awardSlideIndex);
    autoAwardSlideshow();

    document.querySelector(".awards-container .prev").addEventListener("click", () => { clearTimeout(awardSlideshowTimeout); showAwardSlides(--awardSlideIndex); });
    document.querySelector(".awards-container .next").addEventListener("click", () => { clearTimeout(awardSlideshowTimeout); showAwardSlides(++awardSlideIndex); });

    awardList.addEventListener('mouseover', (e) => {
      if (e.target.tagName === 'LI' || e.target.parentElement.tagName === 'LI') {
        const targetLi = e.target.tagName === 'LI' ? e.target : e.target.parentElement;
        clearTimeout(awardSlideshowTimeout);
        const index = targetLi.getAttribute('data-slide-index');
        if (index) {
          showAwardSlides(awardSlideIndex = parseInt(index));
        }
        if (targetLi.id === 'multimedia-award') {
          targetLi.querySelector('.award-details').style.display = 'block';
        }
      }
    });

    awardList.addEventListener('mouseout', (e) => {
      if (e.target.tagName === 'LI' || e.target.parentElement.tagName === 'LI') {
        const targetLi = e.target.tagName === 'LI' ? e.target : e.target.parentElement;
        clearTimeout(awardSlideshowTimeout);
        autoAwardSlideshow();
        if (targetLi.id === 'multimedia-award') {
          targetLi.querySelector('.award-details').style.display = 'none';
        }
      }
    });
  }

  
});