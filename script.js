// Inisialisasi variabel global
let cart = [];
let cartCount = 0;
let cartTotal = 0;
let testimonialSwiper = null;

// Fungsi untuk inisialisasi website
function initWebsite() {
    // Inisialisasi event listeners
    initEventListeners();
    
    // Inisialisasi swiper slider untuk testimoni
    initTestimonialSwiper();
    
    // Inisialisasi animasi scroll
    initScrollAnimations();
    
    // Muat keranjang dari localStorage jika ada
    loadCartFromStorage();
    
    // Update tampilan keranjang
    updateCartDisplay();
    
    // Tampilkan animasi hero
    animateHero();
    
    // Inisialisasi form customer modal
    initCustomerModal();
}

// Fungsi untuk inisialisasi event listeners
function initEventListeners() {
    // Event listener untuk menu mobile
    document.querySelector('.mobile-menu-btn').addEventListener('click', toggleSidebar);
    document.querySelector('.sidebar-close').addEventListener('click', toggleSidebar);
    document.querySelector('.overlay').addEventListener('click', toggleSidebar);
    
    // Event listener untuk navigasi smooth scroll
    document.querySelectorAll('nav a, .sidebar-nav a, .hero-buttons a, .footer-nav a').forEach(anchor => {
        anchor.addEventListener('click', handleSmoothScroll);
    });
    
    // Event listener untuk menu tabs
    document.querySelectorAll('.menu-tab').forEach(tab => {
        tab.addEventListener('click', switchMenuTab);
    });
    
    // Event listener untuk tombol tambah ke keranjang
    document.querySelectorAll('.btn-add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
    
    // Event listener untuk form kontak
    document.getElementById('contactForm').addEventListener('submit', handleContactSubmit);
    
    // Event listener untuk form newsletter
    document.getElementById('newsletterForm').addEventListener('submit', handleNewsletterSubmit);
    
    // Event listener untuk tombol sign in
    document.getElementById('signin-btn').addEventListener('click', openSignInModal);
    
    // Event listener untuk modal sign in
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeModal);
    });
    
    // Event listener untuk tombol keranjang
    document.getElementById('cartButton').addEventListener('click', openCartModal);
    
    // Event listener untuk tombol lanjut belanja
    document.getElementById('continueShopping').addEventListener('click', closeModal);
    
    // Event listener untuk tombol checkout
    document.getElementById('proceedToCheckout').addEventListener('click', proceedToCustomerForm);
    
    // Event listener untuk kembali ke keranjang
    document.getElementById('backToCart').addEventListener('click', backToCartModal);
    
    // Event listener untuk form data pemesan
    document.getElementById('customerForm').addEventListener('submit', handleCustomerFormSubmit);
    
    // Event listener untuk jenis pesanan (show/hide alamat)
    document.getElementById('orderType').addEventListener('change', toggleAddressField);
    
    // Event listener untuk register link
    document.getElementById('registerLink').addEventListener('click', (e) => {
        e.preventDefault();
        closeModal();
        setTimeout(() => {
            showNotification('Fitur pendaftaran akan segera tersedia!');
        }, 300);
    });
    
    // Event listener untuk form sign in
    document.getElementById('signinForm').addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Login berhasil! (simulasi)');
        closeModal();
    });
    
    // Event listener untuk tombol "Pesan Online"
    document.querySelectorAll('.btn-order, .btn-order-sidebar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Tutup sidebar jika terbuka
            if (document.querySelector('.sidebar').classList.contains('active')) {
                toggleSidebar();
            }
            
            // Scroll ke menu section
            scrollToMenuSection();
            
            // Tampilkan notifikasi
            setTimeout(() => {
                showNotification('📋 Silakan pilih menu favorit Anda!');
            }, 500);
        });
    });
    
    // Event listener untuk tombol "Lihat Menu Kami" di hero
    document.querySelector('.hero-buttons .btn-primary').addEventListener('click', (e) => {
        e.preventDefault();
        scrollToMenuSection();
    });
    
    // Event listener untuk window scroll (sticky header)
    window.addEventListener('scroll', handleScroll);
    
    // Event listener untuk klik di luar modal
    window.addEventListener('click', (e) => {
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => {
            if (e.target === modal) {
                closeModal();
            }
        });
    });
}

// Fungsi untuk scroll ke menu section
function scrollToMenuSection() {
    const menuSection = document.getElementById('products');
    if (menuSection) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = menuSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        // Tambah efek highlight
        menuSection.classList.add('highlight');
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Hapus highlight setelah 1.5 detik
        setTimeout(() => {
            menuSection.classList.remove('highlight');
        }, 1500);
    }
}

// Fungsi untuk inisialisasi swiper testimoni
function initTestimonialSwiper() {
    testimonialSwiper = new Swiper('.testimonials-slider', {
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        slidesPerView: 1,
        spaceBetween: 20,
        breakpoints: {
            768: {
                slidesPerView: 2,
                spaceBetween: 25,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 30,
            }
        },
        speed: 800,
    });
}

// Fungsi untuk toggle sidebar (mobile)
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : 'auto';
}

// Fungsi untuk smooth scroll
function handleSmoothScroll(e) {
    const href = this.getAttribute('href');
    
    // Jika href adalah anchor link (dimulai dengan #)
    if (href.startsWith('#')) {
        e.preventDefault();
        
        // Tutup sidebar jika terbuka
        if (document.querySelector('.sidebar').classList.contains('active')) {
            toggleSidebar();
        }
        
        const targetId = href;
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Hitung offset untuk header tetap
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
}

// Fungsi untuk switch menu tab dengan animasi
function switchMenuTab() {
    // Hapus kelas active dari semua tab
    document.querySelectorAll('.menu-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Tambah kelas active ke tab yang diklik
    this.classList.add('active');
    
    const tabId = this.getAttribute('data-tab');
    const categories = document.querySelectorAll('.menu-category');
    
    // Animasi fade out current active
    const currentActive = document.querySelector('.menu-category.active');
    if (currentActive) {
        currentActive.style.opacity = '0';
        currentActive.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            categories.forEach(category => {
                category.classList.remove('active');
                if (category.id === tabId) {
                    category.classList.add('active');
                    // Trigger reflow untuk animasi
                    category.offsetHeight;
                    category.style.opacity = '1';
                    category.style.transform = 'translateY(0)';
                }
            });
        }, 300);
    } else {
        categories.forEach(category => {
            category.classList.remove('active');
            if (category.id === tabId) {
                category.classList.add('active');
            }
        });
    }
}

// Fungsi untuk menambah item ke keranjang
function addToCart() {
    const product = this.getAttribute('data-product');
    const price = parseInt(this.getAttribute('data-price'));
    
    // Cek apakah produk sudah ada di keranjang
    const existingItem = cart.find(item => item.product === product);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            product: product,
            price: price,
            quantity: 1
        });
    }
    
    // Update count dan total
    cartCount += 1;
    cartTotal += price;
    
    // Update tampilan keranjang
    updateCartDisplay();
    
    // Simpan ke localStorage
    saveCartToStorage();
    
    // Tampilkan notifikasi
    showNotification(`✨ ${product} telah ditambahkan ke keranjang!`);
    
    // Animasi tombol keranjang
    animateCartButton();
}

// Fungsi untuk update tampilan keranjang
function updateCartDisplay() {
    // Update counter keranjang
    document.getElementById('cartCount').textContent = cartCount;
    
    // Update modal keranjang jika terbuka
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Keranjang belanja kosong</p>';
    } else {
        let cartHTML = '';
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            cartHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.product}</h4>
                        <p>Rp ${item.price.toLocaleString()} x ${item.quantity}</p>
                    </div>
                    <div class="cart-item-total">
                        <p>Rp ${itemTotal.toLocaleString()}</p>
                        <button class="btn-remove" data-product="${item.product}">Hapus</button>
                    </div>
                </div>
            `;
        });
        cartItemsContainer.innerHTML = cartHTML;
        
        // Tambah event listener untuk tombol hapus
        document.querySelectorAll('.btn-remove').forEach(button => {
            button.addEventListener('click', removeFromCart);
        });
    }
    
    // Update total
    cartTotalElement.textContent = `Rp ${cartTotal.toLocaleString()}`;
}

// Fungsi untuk menghapus item dari keranjang
function removeFromCart() {
    const product = this.getAttribute('data-product');
    const itemIndex = cart.findIndex(item => item.product === product);
    
    if (itemIndex !== -1) {
        const item = cart[itemIndex];
        cartCount -= item.quantity;
        cartTotal -= item.price * item.quantity;
        cart.splice(itemIndex, 1);
        
        updateCartDisplay();
        saveCartToStorage();
        showNotification(`🗑️ ${product} telah dihapus dari keranjang!`);
    }
}

// Fungsi untuk membuka modal sign in
function openSignInModal() {
    // Tutup sidebar jika terbuka
    if (document.querySelector('.sidebar').classList.contains('active')) {
        toggleSidebar();
    }
    
    document.getElementById('signinModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Fungsi untuk membuka modal keranjang
function openCartModal() {
    if (cart.length === 0) {
        showNotification('Keranjang belanja kosong!');
        return;
    }
    
    document.getElementById('cartModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Fungsi untuk menutup modal
function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = 'auto';
}

// Fungsi untuk lanjut ke form pemesan
function proceedToCustomerForm() {
    if (cart.length === 0) {
        showNotification('Keranjang belanja kosong!');
        return;
    }
    
    // Sembunyikan modal keranjang
    document.getElementById('cartModal').classList.remove('active');
    
    // Update ringkasan pesanan
    updateOrderSummary();
    
    // Tampilkan modal pemesan
    setTimeout(() => {
        document.getElementById('customerModal').classList.add('active');
    }, 300);
}

// Fungsi untuk kembali ke modal keranjang
function backToCartModal() {
    // Sembunyikan modal pemesan
    document.getElementById('customerModal').classList.remove('active');
    
    // Tampilkan modal keranjang
    setTimeout(() => {
        document.getElementById('cartModal').classList.add('active');
    }, 300);
}

// Fungsi untuk inisialisasi customer modal
function initCustomerModal() {
    // Set default value untuk select
    document.getElementById('orderType').selectedIndex = 0;
    document.getElementById('orderTime').selectedIndex = 0;
}

// Fungsi untuk update ringkasan pesanan
function updateOrderSummary() {
    const orderSummary = document.getElementById('orderSummary');
    const orderSummaryTotal = document.getElementById('orderSummaryTotal');
    
    let summaryHTML = '';
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        summaryHTML += `
            <div class="order-summary-item">
                <span>${item.product} (${item.quantity}x)</span>
                <span>Rp ${itemTotal.toLocaleString()}</span>
            </div>
        `;
    });
    
    orderSummary.innerHTML = summaryHTML;
    orderSummaryTotal.textContent = `Rp ${cartTotal.toLocaleString()}`;
}

// Fungsi untuk toggle field alamat
function toggleAddressField() {
    const orderType = document.getElementById('orderType').value;
    const addressInput = document.getElementById('customerAddress');
    
    if (orderType === 'delivery') {
        addressInput.setAttribute('required', 'required');
        addressInput.placeholder = 'Contoh: Jl. Contoh No. 123, Kecamatan, Kota *';
    } else {
        addressInput.removeAttribute('required');
        addressInput.placeholder = 'Jl. Contoh No. 123, Kecamatan, Kota';
    }
}

// Fungsi untuk menangani form data pemesan
function handleCustomerFormSubmit(e) {
    e.preventDefault();
    
    // Ambil data dari form
    const customerName = document.getElementById('customerName').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const orderType = document.getElementById('orderType').value;
    const customerAddress = document.getElementById('customerAddress').value;
    const orderTime = document.getElementById('orderTime').value;
    const orderNotes = document.getElementById('orderNotes').value;
    
    // Validasi nomor WhatsApp
    if (!/^628[0-9]{9,12}$/.test(customerPhone)) {
        showNotification('Nomor WhatsApp tidak valid. Gunakan format 628xxxxxxxxxx');
        return;
    }
    
    // Validasi alamat untuk pengantaran
    if (orderType === 'delivery' && !customerAddress.trim()) {
        showNotification('Alamat pengiriman wajib diisi untuk pengantaran');
        return;
    }
    
    // Validasi jenis pesanan
    if (!orderType) {
        showNotification('Silakan pilih jenis pesanan');
        return;
    }
    
    // Validasi waktu pesanan
    if (!orderTime) {
        showNotification('Silakan pilih waktu pengambilan/pengantaran');
        return;
    }
    
    // Format waktu
    const timeText = {
        'asap': 'Segera',
        '30m': '30 Menit lagi',
        '1h': '1 Jam lagi',
        '2h': '2 Jam lagi',
        'specific': 'Waktu spesifik'
    }[orderTime] || orderTime;
    
    // Format jenis pesanan
    const orderTypeText = {
        'takeaway': 'Ambil di Tempat',
        'delivery': 'Antar ke Alamat',
        'dinein': 'Makan di Tempat'
    }[orderType] || orderType;
    
    // Buat pesan untuk WhatsApp
    let message = `*PESANAN KOPI - LUXURY COFFEE*%0A%0A`;
    message += `*DATA PEMESAN*%0A`;
    message += `Nama: ${customerName}%0A`;
    message += `WhatsApp: ${customerPhone}%0A`;
    if (customerEmail) message += `Email: ${customerEmail}%0A`;
    message += `Jenis Pesanan: ${orderTypeText}%0A`;
    if (customerAddress && orderType === 'delivery') message += `Alamat: ${customerAddress}%0A`;
    message += `Waktu: ${timeText}%0A`;
    if (orderNotes) message += `Catatan: ${orderNotes}%0A`;
    
    message += `%0A*DETAIL PESANAN*%0A`;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        message += `- ${item.product} (${item.quantity}x): Rp ${itemTotal.toLocaleString()}%0A`;
    });
    
    message += `%0A*TOTAL: Rp ${cartTotal.toLocaleString()}*%0A%0A`;
    message += `_Pesanan ini dikirim melalui website Luxury Coffee_`;
    
    // Encode pesan untuk WhatsApp
    const whatsappUrl = `https://wa.me/6281234567890?text=${message}`;
    
    // Buka WhatsApp di tab baru
    window.open(whatsappUrl, '_blank');
    
    // Tampilkan notifikasi
    showNotification('✅ Pesanan telah dikirim ke WhatsApp!');
    
    // Kosongkan keranjang
    cart = [];
    cartCount = 0;
    cartTotal = 0;
    updateCartDisplay();
    saveCartToStorage();
    
    // Reset form
    e.target.reset();
    
    // Reset select ke default
    document.getElementById('orderType').selectedIndex = 0;
    document.getElementById('orderTime').selectedIndex = 0;
    
    // Tutup modal
    closeModal();
}

// Fungsi untuk menangani submit form kontak
function handleContactSubmit(e) {
    e.preventDefault();
    
    // Ambil nilai form
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Simulasi pengiriman pesan
    setTimeout(() => {
        // Reset form
        e.target.reset();
        
        // Tampilkan notifikasi
        showNotification('✅ Pesan Anda telah terkirim! Kami akan membalas secepatnya.');
    }, 1000);
}

// Fungsi untuk menangani submit newsletter
function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const email = e.target.querySelector('input[type="email"]').value;
    
    // Simulasi subscribe
    setTimeout(() => {
        // Reset form
        e.target.reset();
        
        // Tampilkan notifikasi
        showNotification('🎉 Terima kasih telah berlangganan newsletter kami!');
    }, 1000);
}

// Fungsi untuk animasi scroll
function handleScroll() {
    // Sticky header
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.padding = '12px 0';
        header.style.backgroundColor = 'rgba(10, 10, 10, 0.98)';
        header.style.backdropFilter = 'blur(15px)';
    } else {
        header.style.padding = '15px 0';
        header.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    }
    
    // Update menu aktif berdasarkan scroll
    updateActiveMenu();
    
    // Trigger animasi reveal
    triggerReveal();
}

// Fungsi untuk update menu aktif berdasarkan scroll
function updateActiveMenu() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a, .sidebar-nav a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Fungsi untuk animasi hero
function animateHero() {
    const heroText = document.querySelector('.hero-text');
    heroText.style.opacity = '0';
    heroText.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        heroText.style.transition = 'opacity 1s ease, transform 1s ease';
        heroText.style.opacity = '1';
        heroText.style.transform = 'translateY(0)';
    }, 500);
}

// Fungsi untuk animasi tombol keranjang
function animateCartButton() {
    const cartButton = document.getElementById('cartButton');
    cartButton.style.transform = 'scale(1.2)';
    
    setTimeout(() => {
        cartButton.style.transform = 'scale(1)';
    }, 300);
}

// Fungsi untuk inisialisasi animasi reveal
function initScrollAnimations() {
    // Tambah kelas reveal ke elemen yang akan dianimasikan
    const elementsToReveal = document.querySelectorAll('.advantage-card, .menu-item-card, .testimonial-card, .contact-info, .contact-form, .location-info, .location-map');
    elementsToReveal.forEach(element => {
        element.classList.add('reveal');
    });
    
    // Trigger pertama kali
    triggerReveal();
}

// Fungsi untuk trigger reveal
function triggerReveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

// Fungsi untuk menampilkan notifikasi
function showNotification(message) {
    // Buat elemen notifikasi
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Tambah ke body
    document.body.appendChild(notification);
    
    // Animasikan masuk
    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);
    
    // Hapus setelah 3 detik
    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Fungsi untuk menyimpan keranjang ke localStorage
function saveCartToStorage() {
    const cartData = {
        items: cart,
        count: cartCount,
        total: cartTotal
    };
    localStorage.setItem('luxuryCoffeeCart', JSON.stringify(cartData));
}

// Fungsi untuk memuat keranjang dari localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('luxuryCoffeeCart');
    if (savedCart) {
        const cartData = JSON.parse(savedCart);
        cart = cartData.items || [];
        cartCount = cartData.count || 0;
        cartTotal = cartData.total || 0;
    }
}

// Inisialisasi website saat halaman dimuat
document.addEventListener('DOMContentLoaded', initWebsite);