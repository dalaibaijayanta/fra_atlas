// ===== Typewriter Effect for About Section =====
const aboutText = document.getElementById('aboutText');

const aboutContent = [
    "🌍 Introducing the FRA Atlas Digital Model",
    "For generations, communities have lived on forested lands with claims written on fragile papers and old maps. These records were scattered, unclear, and difficult to use when people needed government support.",
    "Our model brings these histories into the digital age. Using AI, satellite imagery, and interactive maps, the system transforms dusty pattas and hand-drawn claims into a living, searchable atlas.",
    "🔎 How it works:",
    "✅ Digitization & AI – Old claims are scanned, read, and organized into a clean archive.",
    "✅ Satellite Mapping – Land, water, and forest assets are identified from above.",
    "✅ Interactive FRA Atlas – A smart web map shows pattas, community rights, and village resources in one place.",
    "✅ Decision Support System (DSS) – Suggests the right schemes for the right people, with explainable recommendations.",
    "✨ What this delivers:",
    "📜 A transparent digital record of land and community claims.",
    "🛰️ AI-generated maps of ponds, farms, and forests for every FRA village.",
    "📊 A planning tool that helps ministries, districts, and communities prioritize development fairly and effectively."
];

let lineIndex = 0;
let charIndex = 0;

function typeLine() {
    if (lineIndex < aboutContent.length) {
        let line = aboutContent[lineIndex];
        if (charIndex < line.length) {
            aboutText.textContent += line.charAt(charIndex);
            charIndex++;
            setTimeout(typeLine, 30); // typing speed
        } else {
            aboutText.textContent += "\n\n"; // spacing between lines
            lineIndex++;
            charIndex = 0;
            setTimeout(typeLine, 300); // pause before next line
        }
    } else {
        aboutText.style.opacity = 1; // fully visible
    }
}

const bgVideo = document.querySelector(".bg-video");
if (bgVideo) {
    bgVideo.playbackRate = 0.75; // smoother than 0.5
    bgVideo.style.opacity = "1"; // fade-in after load
    bgVideo.addEventListener("loadeddata", () => {
        bgVideo.play().catch(err => console.log("Autoplay blocked:", err));
    });
}
// ===== Initialize on Window Load =====
window.onload = () => {
    // Start typewriter effect
    aboutText.style.opacity = 1;
    aboutText.style.whiteSpace = "pre-line"; // maintain line breaks
    typeLine();

    // Init background video
    initBackgroundVideo();
};
