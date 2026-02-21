const noblox = require("noblox.js");
const express = require("express");
const app = express();
app.use(express.json());

const GROUP_ID = 35265289;
const COOKIE = process.env.ROBLOX_COOKIE; // Replit Secrets'a ekle
const API_KEY = process.env.API_KEY; // Güvenlik için

async function baslat() {
    await noblox.setCookie(COOKIE);
    const me = await noblox.getCurrentUser();
    console.log("Bot başladı:", me.UserName);
}

// Rütbe atlatma endpoint'i
app.post("/rutbeAtla", async (req, res) => {
    const { userId, apiKey } = req.body;

    // Güvenlik kontrolü
    if (apiKey !== API_KEY) {
        return res.status(403).json({ success: false, hata: "Yetkisiz erişim" });
    }

    try {
        const mevcutRutbe = await noblox.getRankInGroup(GROUP_ID, userId);

        // Rütbe atlama tablosu
        const rutbeTablosu = {
            249: 250,
            // Diğer rütbeleri buraya ekle
        };

        const yeniRutbe = rutbeTablosu[mevcutRutbe];

        if (!yeniRutbe) {
            return res.status(400).json({ success: false, hata: "Atlanacak rütbe bulunamadı" });
        }

        await noblox.setRank(GROUP_ID, userId, yeniRutbe);
        console.log(`${userId} → Rütbe ${mevcutRutbe} → ${yeniRutbe}`);
        res.json({ success: true, yeniRutbe });

    } catch (hata) {
        console.error(hata);
        res.status(500).json({ success: false, hata: hata.message });
    }
});

// Replit'in botu uyutmaması için
app.get("/", (req, res) => res.send("Bot çalışıyor!"));

app.listen(3000, () => console.log("Sunucu açık: port 3000"));
baslat();
