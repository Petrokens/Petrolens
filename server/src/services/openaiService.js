const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.callGPT = async (checklistItem, designText) => {
  const prompt = `
You are a senior civil engineer evaluating a design basis report against a checklist item.

Checklist Item: "${checklistItem}"

Design Basis Extract:
"""
${designText.slice(0, 7000)}
"""

Rules:
- Answer strictly based on IS Codes and civil engineering practice.
- Response must be JSON:
{
  "checklist_item": "...",
  "result": "Yes" or "No",
  "confidence": 0.xx,
  "remark": "short explanation"
}
`;

  const res = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
  });

  const reply = res.choices[0].message.content;
  try {
    return JSON.parse(reply);
  } catch (e) {
    return {
      checklist_item: checklistItem,
      result: "No",
      confidence: 0.5,
      remark: "Failed to parse GPT output",
    };
  }
};
