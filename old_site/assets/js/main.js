// Main JavaScript for the Fractional CTO Website

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();
    
    // Initialize language
    initLanguage();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Close popup when clicking the X button or outside the popup
    const popup = document.getElementById('privacyPopup');
    const closeBtn = document.querySelector('.close');

    closeBtn.onclick = function() {
        popup.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == popup) {
            popup.style.display = 'none';
        }
    }
});

// Theme switcher functionality
function initTheme() {
    const themeSwitch = document.getElementById('themeSwitch');
    const storedTheme = localStorage.getItem('theme') || 'light';
    
    // Set initial theme from localStorage or default
    if (storedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeSwitch.checked = true;
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeSwitch.checked = false;
    }
    
    // Handle theme toggle
    themeSwitch.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });
}

// Language switcher functionality
function initLanguage() {
    const langButtons = document.querySelectorAll('.lang-btn');
    const storedLang = localStorage.getItem('language') || 'es';
    
    // Set initial language from localStorage or default
    langButtons.forEach(btn => {
        if (btn.dataset.lang === storedLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Handle language changes
    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            
            // Update active button
            langButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Save preference
            localStorage.setItem('language', lang);
            
            // In a real app, load language content here
            // For now, we'll just log the language change
            console.log(`Language changed to: ${lang}`);
            
            // This would be replaced with actual language loading logic
            // For a production site, you would either:
            // 1. Redirect to language-specific pages
            // 2. Load language data via fetch and update content
        });
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        const navItems = navLinks.querySelectorAll('a');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Account for fixed header
                behavior: 'smooth'
            });
        }
    });
});

// Privacy Popup Functions
function showPrivacyPopup() {
    document.getElementById('privacyPopup').style.display = 'block';
}
