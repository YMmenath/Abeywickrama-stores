let cart = [];

// පිටු මාරු කිරීමේ function එක
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.style.display = 'none');

    const target = document.getElementById(pageId + '-page');
    if (target) {
        target.style.display = 'block';
    }

    if (pageId === 'cart') {
        renderCart(); 
    }

    const shopHeader = document.querySelector('.section-header');
    if (shopHeader) {
        shopHeader.style.display = (pageId === 'shop') ? 'block' : 'none';
    }

    window.scrollTo(0, 0);
}

// මිල Update කිරීම
function updatePrice(select) {
    let price = select.value;
    let card = select.closest('.product-card');
    if (card) {
        card.querySelector('.price-value').innerText = price;
    }
}

// බඩු එකතු කිරීම
function addToCart(btn) {
    const card = btn.closest('.product-card');
    const name = card.querySelector('h4').innerText;
    const price = parseFloat(card.querySelector('.price-value').innerText);
    const select = card.querySelector('.weight-select');
    const weight = select.options[select.selectedIndex].text.split(' - ')[0];

    cart.push({ name, weight, price });
    document.getElementById('cart-count-badge').innerText = cart.length;
    alert(name + " එකතු කළා!");
}

// Cart එක පෙන්වීම සහ ගණනය කිරීම
function renderCart() {
    let list = document.getElementById('cart-items-list');
    let totalSpan = document.getElementById('total-price');
    let summary = document.getElementById('cart-summary');
    let addressSection = document.getElementById('address-section');

    if (cart.length === 0) {
        list.innerHTML = '<p style="text-align:center; padding:20px;">තවම බඩු කිසිවක් තෝරා නැත.</p>';
        if (summary) summary.style.display = 'none';
        return;
    }

    if (summary) summary.style.display = 'block';
    list.innerHTML = '';
    let itemsTotal = 0;

    cart.forEach((item, index) => {
        itemsTotal += item.price;
        list.innerHTML += `
            <div class="cart-item" style="display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid #eee;">
                <div><strong>${item.name}</strong><br><small>${item.weight}</small></div>
                <div><span>රු. ${item.price}</span><button onclick="removeItem(${index})" class="remove-btn" style="margin-left:10px; background:#ff4d4d; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">මකන්න</button></div>
            </div>`;
    });

    let deliveryOption = document.querySelector('input[name="delivery"]:checked');
    let deliveryCharge = deliveryOption ? parseInt(deliveryOption.value) : 0;

    if (addressSection) {
        if (deliveryCharge === 100) {
            addressSection.style.display = 'block';
            window.deliveryText = "නිවසටම ගෙන්වාගැනීම (රු. 100)";
        } else {
            addressSection.style.display = 'none';
            window.deliveryText = "කඩයට පැමිණ ලබාගැනීම";
        }
    }

    window.totalWithDelivery = itemsTotal + deliveryCharge;
    totalSpan.innerText = window.totalWithDelivery;
}

function removeItem(index) {
    cart.splice(index, 1);
    document.getElementById('cart-count-badge').innerText = cart.length;
    renderCart();
}

// WhatsApp පණිවිඩය යැවීම (වැරදි අකුරු නැතිව ලස්සනට එන ක්‍රමය)
function sendOrder() {
    let name = document.getElementById('customer-name').value;
    let address = document.getElementById('customer-address').value;
    let deliveryOption = document.querySelector('input[name="delivery"]:checked');
    let deliveryCharge = deliveryOption ? parseInt(deliveryOption.value) : 0;

    if (!name) {
        alert("කරුණාකර ඔබේ නම ඇතුළත් කරන්න.");
        return;
    }

    if (deliveryCharge === 100 && !address) {
        alert("කරුණාකර ලිපිනය ඇතුළත් කරන්න.");
        return;
    }

    // Message එක හදන කොටස - මෙතන \n එක ලකුණක් පමණක් භාවිතා කරන්න
    let msg = "📦 *New Order - Abeywickrama Stores* \n";
    msg += "━━━━━━━━━━━━━━━━━━━\n\n";
    msg += "👤 *පාරිභෝගිකයා:* " + name + "\n";
    
    if (deliveryCharge === 100) {
        msg += "📍 *ලිපිනය:* " + address + "\n";
    }

    msg += "\n📝 *ඇණවුම් විස්තරය:*\n";
    cart.forEach((item) => {
        msg += "🔹 " + item.name + " (" + item.weight + ") - *රු. " + item.price + "*\n";
    });

    msg += "\n━━━━━━━━━━━━━━━━━━━\n";
    msg += "🚚 *සේවාව:* " + window.deliveryText + "\n";
    msg += "💰 *මුළු මුදල:* *රු. " + window.totalWithDelivery + ".00*\n\n";
    msg += "ස්තූතියි! 🙏";

    // encodeURIComponent එකෙන් සිංහල අකුරු වල ප්‍රශ්නය විසඳනවා
    let finalUrl = "https://wa.me/94705345300?text=" + encodeURIComponent(msg);
    window.open(finalUrl, '_blank');
}

// Search කිරීම
function searchProduct() {
    let input = document.getElementById('productSearch').value.toLowerCase();
    let cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
        let name = card.querySelector('h4').innerText.toLowerCase();
        card.style.display = name.includes(input) ? "block" : "none";
    });
} 