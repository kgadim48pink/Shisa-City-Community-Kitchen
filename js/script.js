/* script.js - Main JavaScript for Shisa City Community Kitchen */

/* 1. ACCORDION FUNCTIONALITY */

document.addEventListener('DOMContentLoaded', function() {
    // Select all accordion headers on the page
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    // If no accordion headers exist, exit early (avoids errors on other pages)
    if (accordionHeaders.length === 0) return;
    
    // Loop through each header and add a click event
    accordionHeaders.forEach(function(header) {
        header.addEventListener('click', function() {
            // Get the content panel and icon inside this header
            const content = this.nextElementSibling;
            const icon = this.querySelector('.icon');
            
            // Toggle visibility
            content.classList.toggle('show');
            this.classList.toggle('active');
            
            // Update the icon (+ or −)
            icon.textContent = content.classList.contains('show') ? '−' : '+';
        });
    });
});

/* 2. DYNAMIC CONTENT - PROGRAMS LIST */

// Program data
const programs = [
    {
        id: 1,
        name: 'Meal Program',
        icon: '🍲',
        tag: 'Daily Service',
        description: 'Our flagship program provides hot, nutritious meals to community members in need.',
        schedule: 'Monday - Friday, 12:00 PM - 2:00 PM',
        category: 'food'
    },
    {
        id: 2,
        name: 'Cooking Classes',
        icon: '👩‍🍳',
        tag: 'Weekly Classes',
        description: 'Learn essential cooking skills with our free, hands-on cooking classes.',
        schedule: 'Every Thursday, 6:00 PM - 8:00 PM',
        category: 'education'
    },
    {
        id: 3,
        name: 'Food Literacy Program',
        icon: '📚',
        tag: 'Monthly Workshops',
        description: 'Empowering community members with knowledge about nutrition, meal planning, and smart grocery shopping.',
        schedule: 'First Saturday of each month, 10:00 AM - 12:00 PM',
        category: 'education'
    },
    {
        id: 4,
        name: 'Community Garden',
        icon: '🌱',
        tag: 'Growing Together',
        description: 'Fresh, organic vegetables and herbs that supplement our meal program.',
        schedule: 'Open daily, 8:00 AM - 6:00 PM',
        category: 'garden'
    }
];

// Function to display programs
function displayPrograms(programArray) {
    const container = document.getElementById('programList');
    
    if (!container) return; // Only run on services page
    
    if (programArray.length === 0) {
        container.innerHTML = '<p class="no-results">No programs found matching your search.</p>';
        return;
    }
    
    let html = '';
    
    programArray.forEach(function(program) {
        html += `
            <div class="program-detail-card">
                <div class="program-icon">${program.icon}</div>
                <div class="program-info">
                    <h2>${program.name}</h2>
                    <span class="tag">${program.tag}</span>
                    <p>${program.description}</p>
                    <div class="program-details">
                        <span>📅 ${program.schedule}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Initialize programs on page load
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('programList')) {
        displayPrograms(programs);
        
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const query = this.value.toLowerCase();
                const filtered = programs.filter(function(program) {
                    return program.name.toLowerCase().includes(query) ||
                           program.description.toLowerCase().includes(query) ||
                           program.category.toLowerCase().includes(query);
                });
                displayPrograms(filtered);
            });
        }
        
        // Sort functionality
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', function() {
                let sorted = [...programs];
                
                if (this.value === 'name') {
                    sorted.sort((a, b) => a.name.localeCompare(b.name));
                } else if (this.value === 'name-desc') {
                    sorted.sort((a, b) => b.name.localeCompare(a.name));
                }
                
                displayPrograms(sorted);
            });
        }
    }
});

/* 3. FORM VALIDATION - ENQUIRY PAGE */

document.addEventListener('DOMContentLoaded', function() {
    const enquiryForm = document.getElementById('enquiryForm');
    
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            
            // Clear previous errors
            document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
            
            // Validate Name
            const name = document.getElementById('name');
            if (!name.value.trim() || name.value.trim().length < 3) {
                document.getElementById('nameError').textContent = 'Please enter your full name (minimum 3 characters).';
                name.style.borderColor = '#e74c3c';
                isValid = false;
            } else {
                name.style.borderColor = '#27ae60';
            }
            
            // Validate Email
            const email = document.getElementById('email');
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email.value)) {
                document.getElementById('emailError').textContent = 'Please enter a valid email address.';
                email.style.borderColor = '#e74c3c';
                isValid = false;
            } else {
                email.style.borderColor = '#27ae60';
            }
            
            // Validate Phone
            const phone = document.getElementById('phone');
            const phonePattern = /^[0-9\s\-\+\(\)]{10,15}$/;
            if (!phonePattern.test(phone.value)) {
                document.getElementById('phoneError').textContent = 'Please enter a valid phone number (10-15 digits).';
                phone.style.borderColor = '#e74c3c';
                isValid = false;
            } else {
                phone.style.borderColor = '#27ae60';
            }
            
            // Validate Enquiry Type
            const enquiryType = document.getElementById('enquiryType');
            if (!enquiryType.value) {
                document.getElementById('enquiryTypeError').textContent = 'Please select an enquiry type.';
                enquiryType.style.borderColor = '#e74c3c';
                isValid = false;
            } else {
                enquiryType.style.borderColor = '#27ae60';
            }
            
            // Validate Message
            const message = document.getElementById('message');
            if (!message.value.trim() || message.value.trim().length < 10) {
                document.getElementById('messageError').textContent = 'Please enter a message (minimum 10 characters).';
                message.style.borderColor = '#e74c3c';
                isValid = false;
            } else {
                message.style.borderColor = '#27ae60';
            }
            
            // If valid, submit via AJAX
            if (isValid) {
                submitFormAjax(enquiryForm, 'formResponse');
            }
        });
    }
});

/* 4. AJAX FORM SUBMISSION */

function submitFormAjax(form, responseId) {
    const responseDiv = document.getElementById(responseId);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    responseDiv.innerHTML = '';
    
    // Get form data
    const formData = new FormData(form);
    
    // Send AJAX request
    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Success
            responseDiv.innerHTML = '<p class="success-message">✅ Thank you! Your message has been sent successfully. We will get back to you soon.</p>';
            form.reset();
            
            // Reset border colours
            form.querySelectorAll('input, select, textarea').forEach(el => {
                el.style.borderColor = '#e0e0e0';
            });
        } else {
            throw new Error('Form submission failed');
        }
    })
    .catch(error => {
        // Error
        responseDiv.innerHTML = '<p class="error-message">❌ Sorry, there was an error sending your message. Please try again later.</p>';
    })
    .finally(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}
