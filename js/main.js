// Initialize AOS (Animate On Scroll)
AOS.init({
  duration: 1000,
  once: true,
  offset: 100,
  easing: 'ease-out-cubic',
  delay: 0
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero');
  if (hero) {
    const rate = scrolled * 0.5;
    hero.style.transform = `translateY(${rate}px)`;
  }
});

// Calendar Widget
function initCalendar() {
  const calendarContainer = document.getElementById('calendar');
  if (!calendarContainer) return;
  
  const eventDate = new Date(2026, 0, 23); // 23/01/2026 (month is 0-indexed)
  let currentMonth = eventDate.getMonth();
  let currentYear = eventDate.getFullYear();
  
  const monthNames = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
                     'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
  const weekdays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  
  function renderCalendar() {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();
    
    let html = `
      <div class="calendar-header">
        <button class="calendar-nav" onclick="changeMonth(-1)">‹</button>
        <div class="calendar-month-year">
          <span>${monthNames[currentMonth]}</span>
          <span>${currentYear}</span>
        </div>
        <button class="calendar-nav" onclick="changeMonth(1)">›</button>
      </div>
      <div class="calendar-weekdays">
        ${weekdays.map(day => `<div class="calendar-weekday">${day}</div>`).join('')}
      </div>
      <div class="calendar-days">
    `;
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      html += `<div class="calendar-day other-month"></div>`;
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      let classes = 'calendar-day';
      
      if (day === eventDate.getDate() && currentMonth === eventDate.getMonth() && currentYear === eventDate.getFullYear()) {
        classes += ' selected';
      } else if (date.toDateString() === today.toDateString()) {
        classes += ' today';
      }
      
      html += `<div class="${classes}">${day}</div>`;
    }
    
    html += '</div>';
    calendarContainer.innerHTML = html;
  }
  
  window.changeMonth = function(delta) {
    currentMonth += delta;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    } else if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar();
  };
  
  renderCalendar();
}

// Initialize calendar when page loads
document.addEventListener('DOMContentLoaded', () => {
  initCalendar();
  // Load messages khi trang load
  loadMessages();
});

// Open Directions function
function openDirections(address) {
  // Nếu không có địa chỉ, dùng địa chỉ mặc định
  const targetAddress = address || 'Nhà Đa Chức Năng, Trường Đại Học Nông Lâm - Đại Học Huế';
  const encodedAddress = encodeURIComponent(targetAddress);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  window.open(googleMapsUrl, '_blank');
}

// Form submission handler with preview
const rsvpForm = document.getElementById('rsvpForm');
const previewContent = document.getElementById('previewContent');
const guestNameInput = document.getElementById('guestName');
const guestMessageInput = document.getElementById('guestMessage');
const attendanceSelect = document.getElementById('attendance');

// ============================================
// FIREBASE FUNCTIONS - Load và hiển thị lời chúc
// ============================================

const messagesList = document.getElementById('messagesList');
const messagesLoading = document.getElementById('messagesLoading');

// Format thời gian
function formatTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;
  
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Hiển thị một lời chúc
function displayMessage(messageData, messageId) {
  const messageItem = document.createElement('div');
  messageItem.className = 'message-item';
  messageItem.setAttribute('data-id', messageId);
  
  const attendanceClass = messageData.attendance === 'yes' ? 'yes' : 
                         messageData.attendance === 'maybe' ? 'maybe' : 'no';
  const attendanceText = messageData.attendance === 'yes' ? 'Có, sẽ tham dự' : 
                        messageData.attendance === 'maybe' ? 'Có thể' : 'Không thể tham dự';
  
  messageItem.innerHTML = `
    <div class="message-header">
      <span class="message-name">${escapeHtml(messageData.name)}</span>
      <span class="message-attendance ${attendanceClass}">${attendanceText}</span>
    </div>
    <p class="message-text">${escapeHtml(messageData.message)}</p>
    <div class="message-time">${formatTime(messageData.timestamp)}</div>
  `;
  
  return messageItem;
}

// Escape HTML để tránh XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Load tất cả lời chúc từ Firebase
function loadMessages() {
  if (!messagesList) return;
  
  // Kiểm tra Firebase đã được cấu hình chưa
  if (!database || FIREBASE_CONFIG.apiKey === 'YOUR_API_KEY') {
    messagesLoading.classList.add('hidden');
    messagesList.innerHTML = '<p class="preview-placeholder">⚠️ Firebase chưa được cấu hình. Vui lòng xem hướng dẫn trong file HUONG_DAN_FIREBASE.md</p>';
    return;
  }
  
  messagesLoading.classList.remove('hidden');
  
  const messagesRef = database.ref('messages');
  
  // Load messages và sắp xếp theo thời gian (mới nhất trước)
  messagesRef.orderByChild('timestamp').once('value', (snapshot) => {
    messagesLoading.classList.add('hidden');
    messagesList.innerHTML = '';
    
    const messages = [];
    snapshot.forEach((childSnapshot) => {
      messages.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    
    // Sắp xếp mới nhất trước
    messages.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    if (messages.length === 0) {
      messagesList.innerHTML = '<p class="preview-placeholder">Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc nhé! 💝</p>';
      return;
    }
    
    messages.forEach((message) => {
      const messageElement = displayMessage(message, message.id);
      messagesList.appendChild(messageElement);
    });
  });
  
  // Listen for new messages in real-time
  messagesRef.orderByChild('timestamp').limitToLast(1).on('child_added', (snapshot) => {
    const messageData = snapshot.val();
    const messageId = snapshot.key;
    
    // Kiểm tra xem message đã tồn tại chưa
    const existingMessage = messagesList.querySelector(`[data-id="${messageId}"]`);
    if (!existingMessage) {
      const messageElement = displayMessage(messageData, messageId);
      messagesList.insertBefore(messageElement, messagesList.firstChild);
      
      // Giới hạn số lượng message hiển thị (tùy chọn)
      const maxMessages = 100;
      while (messagesList.children.length > maxMessages) {
        messagesList.removeChild(messagesList.lastChild);
      }
    }
  });
}

// Lưu lời chúc vào Firebase
function saveMessageToFirebase(formData) {
  return new Promise((resolve, reject) => {
    if (!database || FIREBASE_CONFIG.apiKey === 'YOUR_API_KEY') {
      reject('Firebase chưa được cấu hình. Vui lòng xem hướng dẫn trong file HUONG_DAN_FIREBASE.md');
      return;
    }
    
    const messagesRef = database.ref('messages');
    const newMessageRef = messagesRef.push();
    
    const messageData = {
      name: formData.name,
      message: formData.message,
      attendance: formData.attendance,
      attendanceText: formData.attendanceText,
      timestamp: Date.now()
    };
    
    newMessageRef.set(messageData)
      .then(() => {
        console.log('Message saved to Firebase:', newMessageRef.key);
        resolve(newMessageRef.key);
      })
      .catch((error) => {
        console.error('Error saving message to Firebase:', error);
        reject(error);
      });
  });
}

// ============================================
// FIREBASE CONFIGURATION
// ============================================
// Để lưu trữ và hiển thị lời chúc công khai:
// 1. Truy cập https://console.firebase.google.com/
// 2. Tạo project mới hoặc chọn project có sẵn
// 3. Vào Project Settings → General → Your apps → Web app
// 4. Copy Firebase config và dán vào bên dưới
// 5. Vào Realtime Database → Create database → Start in test mode
// 6. Copy Database URL và dán vào databaseURL bên dưới
// ============================================

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAEczMRSFxYo1sXq8ggp4fNp4d3QulJtKU",
  authDomain: "thumoithamduletotnghiep.firebaseapp.com",
  databaseURL: "https://thumoithamduletotnghiep-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "thumoithamduletotnghiep",
  storageBucket: "thumoithamduletotnghiep.firebasestorage.app",
  messagingSenderId: "389926271622",
  appId: "1:389926271622:web:f5c69b98748910e5ba6f07"
};

// Khởi tạo Firebase
let database;
if (typeof firebase !== 'undefined') {
  firebase.initializeApp(FIREBASE_CONFIG);
  database = firebase.database();
}

// ============================================
// EMAILJS CONFIGURATION
// ============================================
// Để nhận email khi có người gửi lời chúc:
// 1. Đăng ký tài khoản tại: https://www.emailjs.com/
// 2. Tạo Email Service (Gmail) và lấy Service ID
// 3. Tạo Email Template và lấy Template ID
// 4. Lấy Public Key từ Account settings
// 5. Cập nhật các giá trị bên dưới
// Xem hướng dẫn chi tiết trong file: EMAILJS_SETUP.md
// ============================================

const EMAILJS_CONFIG = {
  serviceID: 'YOUR_SERVICE_ID',      // Thay bằng Service ID từ EmailJS (ví dụ: 'service_abc123')
  templateID: 'YOUR_TEMPLATE_ID',    // Thay bằng Template ID từ EmailJS (ví dụ: 'template_xyz789')
  publicKey: 'YOUR_PUBLIC_KEY'       // Thay bằng Public Key từ EmailJS (ví dụ: 'abcdefghijklmnop')
};

// Khởi tạo EmailJS
if (typeof emailjs !== 'undefined') {
  emailjs.init(EMAILJS_CONFIG.publicKey);
}

// Function để gửi email
function sendEmailViaEmailJS(formData) {
  return new Promise((resolve, reject) => {
    if (typeof emailjs === 'undefined') {
      reject('EmailJS chưa được tải. Vui lòng kiểm tra kết nối internet.');
      return;
    }

    const templateParams = {
      to_name: 'Ngọc Thúy',
      from_name: formData.name,
      message: formData.message,
      attendance: formData.attendanceText,
      reply_to: formData.email || 'no-reply@example.com',
      date: new Date().toLocaleString('vi-VN')
    };

    emailjs.send(
      EMAILJS_CONFIG.serviceID,
      EMAILJS_CONFIG.templateID,
      templateParams
    )
    .then((response) => {
      console.log('Email sent successfully!', response.status, response.text);
      resolve(response);
    })
    .catch((error) => {
      console.error('Email sending failed:', error);
      reject(error);
    });
  });
}

if (rsvpForm) {
  rsvpForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = guestNameInput ? guestNameInput.value.trim() : '';
    const message = guestMessageInput ? guestMessageInput.value.trim() : '';
    const attendance = attendanceSelect ? attendanceSelect.value : '';
    const submitBtn = this.querySelector('.btn-submit');
    
    if (name && message && attendance) {
      // Animation khi submit
      submitBtn.textContent = 'Đang gửi...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
      
      const attendanceText = attendance === 'yes' ? 'Có, tôi sẽ tham dự' : 
                            attendance === 'maybe' ? 'Có thể' : 'Không thể tham dự';
      
      // Gửi email qua EmailJS
      const formData = {
        name: name,
        message: message,
        attendance: attendance,
        attendanceText: attendanceText
      };
      
      // Lưu vào Firebase trước
      saveMessageToFirebase(formData)
        .then(() => {
          // Sau đó gửi email (nếu có cấu hình)
          if (EMAILJS_CONFIG.serviceID !== 'YOUR_SERVICE_ID') {
            return sendEmailViaEmailJS(formData).catch(err => {
              console.log('Email không gửi được nhưng đã lưu vào Firebase:', err);
            });
          }
        })
        .then(() => {
          // Thành công
          showNotification(`Cảm ơn ${name}! Lời chúc của bạn đã được gửi! 💝`, 'success');
          
          // Reset form
          if (guestNameInput) guestNameInput.value = '';
          if (guestMessageInput) guestMessageInput.value = '';
          if (attendanceSelect) attendanceSelect.value = '';
          
          submitBtn.textContent = 'GỬI NGAY!';
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
          
          // Scroll to messages section để xem lời chúc mới
          setTimeout(() => {
            const previewSection = document.querySelector('.preview-section');
            if (previewSection) {
              previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 500);
        })
        .catch((error) => {
          // Lỗi
          console.error('Error saving message:', error);
          showNotification('Có lỗi xảy ra. Vui lòng thử lại sau!', 'error');
          
          submitBtn.textContent = 'GỬI NGAY!';
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
        });
    } else {
      showNotification('Vui lòng điền đầy đủ thông tin!', 'error');
    }
  });
}

// Notification function
function showNotification(message, type = 'success') {
  // Remove existing notification if any
  const existing = document.querySelector('.notification');
  if (existing) {
    existing.remove();
  }
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4caf50' : '#f44336'};
    color: white;
    padding: 15px 25px;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideInRight 0.3s ease;
    font-size: 16px;
    max-width: 300px;
  `;
  
  document.body.appendChild(notification);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add CSS animations for notification
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Gallery image click handler (for future lightbox)
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', function() {
    const img = this.querySelector('img');
    if (img) {
      // Add ripple effect
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.6);
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
      `;
      
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (rect.width / 2 - size / 2) + 'px';
      ripple.style.top = (rect.height / 2 - size / 2) + 'px';
      
      this.style.position = 'relative';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    }
  });
});

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes ripple {
    to {
      transform: scale(2);
      opacity: 0;
    }
  }
`;
document.head.appendChild(rippleStyle);

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(20px)';
  section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(section);
});

// Add loading animation
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});

// Prevent form submission on Enter key in textarea (allow Shift+Enter for new line)
document.querySelectorAll('textarea').forEach(textarea => {
  textarea.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      // Allow normal behavior, form will handle it
    }
  });
});

// Add hover effect to gallery items on mobile (touch devices)
if ('ontouchstart' in window) {
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.98)';
    });
    
    item.addEventListener('touchend', function() {
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  });
}
