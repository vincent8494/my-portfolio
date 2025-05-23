function copyToClipboard(text, event) {
    // Create or get the tooltip
    let tooltip = document.querySelector('.copy-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'copy-tooltip';
        document.body.appendChild(tooltip);
    }

    // Position the tooltip near the cursor
    const x = event.clientX;
    const y = event.clientY;
    
    tooltip.style.left = `${x + 10}px`;
    tooltip.style.top = `${y - 10}px`;
    tooltip.textContent = 'Copied!';
    
    // Show the tooltip
    tooltip.classList.add('visible');
    
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        // Try to execute the copy command
        const successful = document.execCommand('copy');
        if (!successful) {
            // Fallback to modern clipboard API if execCommand fails
            navigator.clipboard.writeText(text).catch(console.error);
        }
    } catch (err) {
        console.error('Copy failed:', err);
        tooltip.textContent = 'Copy failed';
    }
    
    // Clean up
    document.body.removeChild(textarea);
    
    // Hide the tooltip after 2 seconds
    setTimeout(() => {
        if (tooltip) {
            tooltip.classList.remove('visible');
            // Remove the tooltip after the fade-out transition
            setTimeout(() => {
                if (tooltip && tooltip.parentNode) {
                    tooltip.parentNode.removeChild(tooltip);
                }
            }, 200);
        }
    }, 2000);
}

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const formDataObj = Object.fromEntries(formData.entries());
            
            try {
                // Here you would typically send the form data to your server
                // For now, we'll just show a success message
                console.log('Form submitted:', formDataObj);
                
                // Show success message
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalText = submitButton.innerHTML;
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                
                // Reset form
                contactForm.reset();
                
                // Revert button after 3 seconds
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalText;
                }, 3000);
                
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('There was an error sending your message. Please try again later.');
            }
        });
    }

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });

                // Close mobile menu after clicking link
                if (navLinks) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    // Resume download handler
    const downloadResume = document.querySelector('.download-resume');
    if (downloadResume) {
        downloadResume.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Please upload your resume file and update the link in the HTML.');
            // When you have your resume file, update the HTML with the correct path:
            // <a href="/path/to/your-resume.pdf" class="btn primary-btn download-resume" download>
        });
    }
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            navbar.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
            navbar.classList.remove('scroll-up');
            navbar.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
            navbar.classList.remove('scroll-down');
            navbar.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

});
