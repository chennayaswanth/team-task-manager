// Local development server
// In production (Vercel), api/index.js is used instead
const app = require('./app');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
