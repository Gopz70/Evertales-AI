require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`EverTales AI backend running on http://localhost:${PORT}`);
});
