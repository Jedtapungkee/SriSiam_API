const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const { rules } = require("../utils/rules");

const storeInfo = `
    ร้าน Srisiam Uniforms
    ประเภทสินค้า: ชุดเครื่องแบบนักเรียน
    เวลาทำการ: เปิดทุกวัน 7:00 น. - 20:00 น.
    ที่อยู่: 109 ถนนประชานิยม ตำบลบ้านโป่ง อำเภอบ้านโป่ง จังหวัดราชบุรี 70110
    เบอร์โทรศัพท์: 032-211-856
    ค่าจัดส่ง: เริ่มต้น 40 บาท (คิดตามน้ำหนักและขนาด) ใช้เวลา 2-3 วันทำการ
    การชำระเงิน: โอนเงิน, บัตรเครดิต, เก็บเงินปลายทาง
    การเปลี่ยนสินค้า: เปลี่ยนได้ภายใน 7 วัน (สินค้าต้องอยู่ในสภาพเดิม)
    บริการเพิ่มเติม: รับปักชื่อ/ปักตรา ใช้เวลา 3-5 วันทำการ
    ข้อมูลสินค้าเพิ่มเติม: สามารถหาได้ภายในหน้า shop ของเรา
  `;

async function callGeminiAPI(message) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
    คุณคือผู้ช่วยเสมือนที่เชี่ยวชาญในการตอบคำถามเกี่ยวกับร้านค้าออนไลน์ของเรา ซึ่งขายสินค้าเกี่ยวกับชุดเครื่องแบบนักเรียน
    กรุณาใช้ข้อมูลต่อไปนี้ในการตอบคำถาม และตอบคำถามลงท้ายด้วยคำว่า "ค่ะ"
    คุณสามารถใช้ข้อมูลร้านค้าเหล่านี้เพื่อให้คำตอบที่ถูกต้องและเหมาะสมกับคำถามของลูกค้า
    ข้อมูลร้านค้า: ${storeInfo}
    กรุณาตอบคำถามนี้: "${message}" `;

    // console.log("Prompt to Gemini:", prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "ขออภัยครับ ตอนนี้ผมไม่สามารถตอบคำถามนี้ได้";
  }
}

module.exports = {
  callGeminiAPI,
};
