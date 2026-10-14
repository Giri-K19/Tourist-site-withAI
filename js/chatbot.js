/* ===================================================
   ADVENTURE Knowledge-Base Chatbot Engine
   =================================================== */

document.addEventListener("DOMContentLoaded", () => {
    const chatbotToggler = document.querySelector(".chatbot-toggler");
    const chatbotCloseBtn = document.querySelector(".chatbot-close-btn");
    const chatbotResetBtn = document.querySelector(".chatbot-reset-btn");
    const chatBody = document.querySelector(".chatbot-body");
    const chatForm = document.querySelector(".chatbot-form");
    const chatInput = document.querySelector(".chatbot-input");

    // Toggle Chatbot UI
    if (chatbotToggler) {
        chatbotToggler.addEventListener("click", () => {
            document.body.classList.toggle("show-chatbot");
            if (document.body.classList.contains("show-chatbot")) {
                chatInput.focus();
            }
        });
    }

    if (chatbotCloseBtn) {
        chatbotCloseBtn.addEventListener("click", () => {
            document.body.classList.remove("show-chatbot");
        });
    }

    // Format timestamp
    const getTime = () => {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    // Append user message
    const appendUserMessage = (text) => {
        const msgDiv = document.createElement("div");
        msgDiv.className = "chat-msg user";
        msgDiv.innerHTML = `
            <div class="chat-msg-content">
                <p>${escapeHtml(text)}</p>
                <span class="chat-msg-time">${getTime()}</span>
            </div>
        `;
        chatBody.appendChild(msgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    };

    // Append typing indicator
    const showTypingIndicator = () => {
        const typingDiv = document.createElement("div");
        typingDiv.className = "chat-msg bot typing-indicator-msg";
        typingDiv.innerHTML = `
            <div class="chat-msg-avatar"><i class="fa fa-compass"></i></div>
            <div class="chat-typing">
                <span></span><span></span><span></span>
            </div>
        `;
        chatBody.appendChild(typingDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
        return typingDiv;
    };

    // Escape HTML utility
    const escapeHtml = (unsafe) => {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    // Append bot response
    const appendBotResponse = (htmlContent, showChips = false) => {
        const msgDiv = document.createElement("div");
        msgDiv.className = "chat-msg bot";
        msgDiv.innerHTML = `
            <div class="chat-msg-avatar"><i class="fa fa-compass"></i></div>
            <div class="chat-msg-content">
                ${htmlContent}
                <span class="chat-msg-time">${getTime()}</span>
                ${showChips ? renderChips() : ""}
            </div>
        `;
        chatBody.appendChild(msgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
        attachChipListeners();
    };

    // Render Quick FAQ Chips
    const renderChips = () => {
        return `
            <div class="chatbot-chips">
                <button type="button" class="chatbot-chip" data-query="Upcoming Events">🏔️ Upcoming Events</button>
                <button type="button" class="chatbot-chip" data-query="Tour Schedules">🗺️ Tour Schedules</button>
                <button type="button" class="chatbot-chip" data-query="Contact Info">📞 Contact Info</button>
                <button type="button" class="chatbot-chip" data-query="How to Book">📝 Booking / Message</button>
                <button type="button" class="chatbot-chip" data-query="About ADVENTURE">ℹ️ About Us</button>
            </div>
        `;
    };

    // Attach click listeners to chips
    const attachChipListeners = () => {
        const chips = chatBody.querySelectorAll(".chatbot-chip");
        chips.forEach((chip) => {
            chip.onclick = (e) => {
                const query = e.currentTarget.getAttribute("data-query");
                handleUserInput(query);
            };
        });
    };

    // Reset Chatbot
    const resetChat = () => {
        chatBody.innerHTML = `
            <div class="chat-msg bot">
                <div class="chat-msg-avatar"><i class="fa fa-compass"></i></div>
                <div class="chat-msg-content">
                    <p>👋 Hello! Welcome to <strong>ADVENTURE Support</strong>.</p>
                    <p>I can assist you strictly with upcoming events, tour schedules, bookings, and contact details. Choose a topic below or type your question:</p>
                    <span class="chat-msg-time">${getTime()}</span>
                    ${renderChips()}
                </div>
            </div>
        `;
        attachChipListeners();
    };

    if (chatbotResetBtn) {
        chatbotResetBtn.addEventListener("click", resetChat);
    }

    // Knowledge Base Answering Logic (Strictly Adhering to Prompt)
    const getBotAnswer = (query) => {
        const q = query.toLowerCase().trim();

        // 1. Greetings
        if (
            /^(hi|hello|hey|greetings|good morning|good afternoon|good evening|howdy)/i.test(q)
        ) {
            return {
                html: `<p>Hello! How can I help you today? You can ask about our <strong>Upcoming Events</strong>, <strong>Tour Schedules</strong>, <strong>Contact Info</strong>, or <strong>Booking details</strong>.</p>`,
                chips: true
            };
        }

        // 2. Thank you / Goodbyes
        if (/^(thank|thanks|thank you|bye|goodbye|cya)/i.test(q)) {
            return {
                html: `<p>You're very welcome! Have a wonderful adventure ahead! 🌄 Let us know if you need anything else.</p>`,
                chips: false
            };
        }

        // 3. Upcoming Events
        if (
            q.includes("event") ||
            q.includes("everest") ||
            q.includes("trek") ||
            q.includes("walking") ||
            q.includes("walk") ||
            q.includes("andaman") ||
            q.includes("beach") ||
            q.includes("diving")
        ) {
            return {
                html: `
                    <p><strong>🏔️ Upcoming Events:</strong></p>
                    <ul>
                        <li><strong>Everest Camp Trek:</strong> World-renowned Himalayan adventure trek to Everest Base Camp.</li>
                        <li><strong>Walking Holidays:</strong> Guided group walks, challenging treks, and luxury private guided walk experiences.</li>
                        <li><strong>Andaman Beaches:</strong> Exceptional diving and exploration across rich coral reef ecosystems.</li>
                    </ul>
                    <p><a href="#events" onclick="document.body.classList.remove('show-chatbot')">👉 View Events Section</a></p>
                `,
                chips: false
            };
        }

        // 4. Tours & Schedules
        if (
            q.includes("tour") ||
            q.includes("schedule") ||
            q.includes("destination") ||
            q.includes("port of spain") ||
            q.includes("gasparee") ||
            q.includes("caves") ||
            q.includes("trinidad") ||
            q.includes("dates") ||
            q.includes("when")
        ) {
            return {
                html: `
                    <p><strong>🗺️ Upcoming Tours & Destination Schedules:</strong></p>
                    <ul>
                        <li><strong>Wed 28 Sept:</strong> Port of Spain City Tour and Birdseye Fort View.</li>
                        <li><strong>Sat 1 Oct:</strong> Tour the Gasparee Caves.</li>
                        <li><strong>Tues 4 Oct:</strong> Trinidad North Coast Experience.</li>
                    </ul>
                    <p><a href="#tours" onclick="document.body.classList.remove('show-chatbot')">👉 View Tours Section</a></p>
                `,
                chips: false
            };
        }

        // 5. Contact Info
        if (
            q.includes("contact") ||
            q.includes("email") ||
            q.includes("mail") ||
            q.includes("phone") ||
            q.includes("call") ||
            q.includes("number") ||
            q.includes("address") ||
            q.includes("location") ||
            q.includes("reach") ||
            q.includes("support")
        ) {
            return {
                html: `
                    <p><strong>📞 ADVENTURE Contact Details:</strong></p>
                    <ul>
                        <li><strong>Email:</strong> <a href="mailto:tourism@adventure.com">tourism@adventure.com</a></li>
                        <li><strong>Phone:</strong> (+91) 1111111111</li>
                        <li><strong>Location:</strong> India</li>
                    </ul>
                    <p><a href="#contact" onclick="document.body.classList.remove('show-chatbot')">👉 Go to Contact Section</a></p>
                `,
                chips: false
            };
        }

        // 6. Booking / Inquiries / Message Form
        if (
            q.includes("book") ||
            q.includes("booking") ||
            q.includes("inquir") ||
            q.includes("message") ||
            q.includes("form") ||
            q.includes("register") ||
            q.includes("reserve") ||
            q.includes("how to") ||
            q.includes("ticket")
        ) {
            return {
                html: `
                    <p><strong>📝 Booking & Inquiries:</strong></p>
                    <p>To book or inquire about any event or tour, please submit a message using our <strong>Contact Form</strong> on the website or email us directly at <a href="mailto:tourism@adventure.com">tourism@adventure.com</a>.</p>
                    <p><a href="#contact" onclick="document.body.classList.remove('show-chatbot')">👉 Open Contact Form</a></p>
                `,
                chips: false
            };
        }

        // 7. About ADVENTURE
        if (
            q.includes("about") ||
            q.includes("who are you") ||
            q.includes("what is adventure") ||
            q.includes("company")
        ) {
            return {
                html: `
                    <p><strong>ℹ️ About ADVENTURE:</strong></p>
                    <p>ADVENTURE is your premier portal for exploring world-class treks, coastal expeditions, and cultural destination tours designed to inspire and delight travel enthusiasts worldwide.</p>
                    <p><a href="#about" onclick="document.body.classList.remove('show-chatbot')">👉 View About Section</a></p>
                `,
                chips: false
            };
        }

        // 8. Strict Fallback Response (Per System Prompt)
        return {
            html: `<p>I can only help with questions regarding our upcoming events, tour schedules, and contact details. For other inquiries, please reach out via our contact page or email us directly at <a href="mailto:tourism@adventure.com">tourism@adventure.com</a>.</p>`,
            chips: true
        };
    };

    // Process User Input
    const handleUserInput = (queryText) => {
        const text = queryText || chatInput.value.trim();
        if (!text) return;

        appendUserMessage(text);
        if (!queryText) chatInput.value = "";

        const typingIndicator = showTypingIndicator();

        // Simulate natural response delay (350ms - 500ms)
        setTimeout(() => {
            if (typingIndicator && typingIndicator.parentNode) {
                typingIndicator.remove();
            }
            const response = getBotAnswer(text);
            appendBotResponse(response.html, response.chips);
        }, 400);
    };

    // Form submit
    if (chatForm) {
        chatForm.addEventListener("submit", (e) => {
            e.preventDefault();
            handleUserInput();
        });
    }

    // Initialize default chips listeners
    attachChipListeners();
});
