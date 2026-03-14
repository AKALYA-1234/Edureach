const Groq = require('groq-sdk');

let groq;
function getGroqClient() {
  if (!groq) groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'placeholder' });
  return groq;
}

const GRADE_GUIDANCE = {
  'Class 6':  'The student is in Class 6 (age ~11). Use very simple language, short sentences, and basic concepts only. Avoid jargon entirely. Use fun everyday comparisons from a child\'s world — toys, games, school life.',
  'Class 7':  'The student is in Class 7 (age ~12). Use simple, clear language suitable for a pre-teen. Introduce terms gently with explanations. Relate to relatable Indian everyday life.',
  'Class 8':  'The student is in Class 8 (age ~13). Language can be slightly more detailed. Introduce some technical terms but always define them. Keep examples familiar and Indian.',
  'Class 9':  'The student is in Class 9 (age ~14). Standard middle-school level. Introduce proper terminology. Examples can include sports, transport, everyday Indian scenarios. Explain step by step.',
  'Class 10': 'The student is in Class 10 (age ~15) preparing for CBSE/State board exams. Be precise and exam-oriented. Use correct terminology. Align answers with NCERT syllabus.',
  'Class 11': 'The student is in Class 11 (age ~16-17). Use technical language appropriate for higher secondary. Cover concepts at depth. Connect to real-world applications and competitive exam relevance (JEE/NEET/CUET).',
  'Class 12': 'The student is in Class 12 (age ~17-18) preparing for board exams and competitive exams (JEE/NEET/CUET). Use precise technical language, include derivations where relevant, and match board exam answer depth and format.',
};

function buildSystemPrompt(grade) {
  const guidance = GRADE_GUIDANCE[grade] || GRADE_GUIDANCE['Class 9'];
  return `You are EduBot 🤖, a friendly and patient AI tutor for Indian school students.

${guidance}

Your style:
- Explain concepts in clear English calibrated to the student's grade level above
- Use everyday Indian examples (cricket, Diwali, chai, train journeys, etc.) to make concepts relatable
- Keep answers between 150 and 200 words — concise but complete
- Use emojis occasionally to make learning fun and engaging 😊
- Break down complex topics step by step
- Encourage the student and be supportive
- If a concept has a formula, write it clearly
- For Class 6–8: prioritise simplicity and basic understanding
- For Class 9–10: align with NCERT board exam syllabus and standard answer format
- For Class 11–12: include derivations where relevant, use technical precision, and prepare the student for competitive exams`;
}

exports.askDoubt = async (req, res) => {
  try {
    const { question, subject, grade = 'Class 9', history = [] } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ success: false, error: 'Question is required.' });
    }

    const messages = [
      { role: 'system', content: buildSystemPrompt(grade) },
      ...history.slice(-6).map((m) => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.content,
      })),
      {
        role: 'user',
        content: subject && subject !== 'All'
          ? `[Subject: ${subject}] ${question}`
          : question,
      },
    ];

    const completion = await getGroqClient().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      max_tokens: 400,
      temperature: 0.7,
    });

    const answer = completion.choices[0]?.message?.content?.trim() || '';
    res.json({ success: true, answer });
  } catch (err) {
    console.error('Doubt controller error:', err);
    if (err.status === 401) {
      return res.status(500).json({ success: false, error: 'AI service configuration error.' });
    }
    res.status(500).json({ success: false, error: 'Could not get an answer right now. Please try again!' });
  }
};
