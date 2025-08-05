const { callGeminiAPI, callGeminiForSearch } = require("../config/gemini");
const prisma = require("../config/prisma");
const { rules } = require("../utils/rules");

exports.chatWithBot = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({
        message: "กรุณาใส่ข้อความ",
      });
    }
    const lowerMessage = message.toLowerCase();
    const responseMessages = []; // ใช้ array เพื่อเก็บหลายคำตอบ
    // Layer 1: Rule-based
    for (const rule of rules) {
      if (rule.regex && rule.regex.test(lowerMessage)) {
        const result = await rule.handler(lowerMessage);
        if (result) {
          responseMessages.push(result.message);
        }
      }
    }
    let finalResponse = "ขออภัย ฉันไม่เข้าใจคำถามของคุณ";
    if (responseMessages.length > 0) {
      finalResponse = responseMessages.join(" "); // รวมคำตอบทั้งหมดเข้าด้วยกัน
    } else {
      // Layer 2: LLM-based
      finalResponse = await callGeminiAPI(message); // ฟังก์ชัน LLM สำหรับคำถามทั่วไป
    }
    res.json({
      message: finalResponse,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Chatbot Error",
    });
  }
};
