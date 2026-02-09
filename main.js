// main.js
// Set your Supabase credentials
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Section elements
const sectionHome = document.getElementById('sectionHome');
const sectionLogin = document.getElementById('sectionLogin');
const sectionDashboard = document.getElementById('sectionDashboard');
const sectionMakeBook = document.getElementById('sectionMakeBook');

// Nav buttons
const navHome = document.getElementById('navHome');
const navLogin = document.getElementById('navLogin');
const navDashboard = document.getElementById('navDashboard');
const navLogout = document.getElementById('navLogout');

// Show only one section
function showSection(section) {
  sectionHome.style.display = 'none';
  sectionLogin.style.display = 'none';
  sectionDashboard.style.display = 'none';
  sectionMakeBook.style.display = 'none';
  section.style.display = '';
}

// Navigation
navHome.onclick = () => showSection(sectionHome);
navLogin.onclick = () => showSection(sectionLogin);
navDashboard.onclick = () => {
  showSection(sectionDashboard);
  fetchBooks();
};
navLogout.onclick = async () => {
  await supabase.auth.signOut();
  navLogout.style.display = 'none';
  navLogin.style.display = '';
  showSection(sectionHome);
};

// Home AI
const aiBtnMain = document.getElementById('aiBtnMain');
aiBtnMain.onclick = () => {
  const prompt = document.getElementById('aiPromptMain').value;
  document.getElementById('aiResponseMain').textContent = 'AI says: ' + (prompt ? `Here is a book idea: ${prompt}... (expand with your creativity!)` : 'Please enter a prompt.');
};

// Login/Register
const loginForm = document.getElementById('loginForm');
const loginMsg = document.getElementById('loginMsg');
const registerBtn = document.getElementById('registerBtn');
loginForm.onsubmit = async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (!error) {
    navLogout.style.display = '';
    navLogin.style.display = 'none';
    showSection(sectionDashboard);
    fetchBooks();
  }
  loginMsg.textContent = error ? error.message : 'Signed in!';
};
registerBtn.onclick = async () => {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const { error } = await supabase.auth.signUp({ email, password });
  loginMsg.textContent = error ? error.message : 'Registered!';
};

// Dashboard
const addBookBtn = document.getElementById('addBookBtn');
const booksList = document.getElementById('booksList');
addBookBtn.onclick = () => {
  showSection(sectionMakeBook);
};

// Fetch and display books
async function fetchBooks() {
  const { data, error } = await supabase.from('books').select('*').order('created_at', { ascending: false });
  if (error) {
    booksList.innerHTML = '<p>Error loading books.</p>';
    return;
  }
  booksList.innerHTML = '';
  data.forEach(book => {
    booksList.innerHTML += `
      <div class="book-card">
        <h3>${book.title}</h3>
        ${book.cover ? `<img src="${book.cover}" alt="Book Cover" style="max-width:120px;">` : ''}
        <p>${book.content}</p>
        <div class="comments" id="comments-${book.id}"></div>
        <input type="text" id="comment-input-${book.id}" placeholder="Add a comment...">
        <button onclick="addComment(${book.id})">Comment</button>
      </div>
    `;
    fetchComments(book.id);
  });
}

// Comments
window.addComment = async function (bookId) {
  const input = document.getElementById(`comment-input-${bookId}`);
  const content = input.value;
  if (!content) return;
  const { error } = await supabase.from('comments').insert([{ book_id: bookId, content }]);
  if (!error) fetchComments(bookId);
  input.value = '';
};
async function fetchComments(bookId) {
  const { data, error } = await supabase.from('comments').select('*').eq('book_id', bookId).order('created_at', { ascending: true });
  const commentsDiv = document.getElementById(`comments-${bookId}`);
  if (error) {
    commentsDiv.innerHTML = '<p>Error loading comments.</p>';
    return;
  }
  commentsDiv.innerHTML = '<b>Comments:</b><br>' + data.map(c => `<div class="comment">${c.content}</div>`).join('');
}

// Dashboard AI
const aiBtnDash = document.getElementById('aiBtnDash');
aiBtnDash.onclick = () => {
  const prompt = document.getElementById('aiPromptDash').value;
  document.getElementById('aiResponseDash').textContent = 'AI says: ' + (prompt ? `Here is a book idea: ${prompt}... (expand with your creativity!)` : 'Please enter a prompt.');
};

// Make Book
const manualBookForm = document.getElementById('manualBookForm');
const manualBookMsg = document.getElementById('manualBookMsg');
manualBookForm.onsubmit = async (e) => {
  e.preventDefault();
  const title = document.getElementById('manualBookTitle').value;
  const content = document.getElementById('manualBookContent').value;
  const cover = document.getElementById('manualBookCover').value;
  const { error } = await supabase.from('books').insert([{ title, content, cover }]);
  manualBookMsg.textContent = error ? error.message : 'Book added!';
  if (!error) {
    manualBookForm.reset();
    showSection(sectionDashboard);
    fetchBooks();
  }
};
const aiBookBtn = document.getElementById('aiBookBtn');
const aiBookPrompt = document.getElementById('aiBookPrompt');
const aiBookResult = document.getElementById('aiBookResult');
aiBookBtn.onclick = async () => {
  const prompt = aiBookPrompt.value;
  if (!prompt) {
    aiBookResult.textContent = 'Please enter a prompt.';
    return;
  }
  // Demo AI: generate a fake book
  const fakeTitle = 'AI Book: ' + prompt;
  const fakeContent = 'Once upon a time, ' + prompt + ' ... (generated by AI)';
  const fakeCover = 'https://source.unsplash.com/400x600/?book,ai';
  aiBookResult.innerHTML = `
    <h3>${fakeTitle}</h3>
    <img src="${fakeCover}" alt="Book Cover" style="max-width:120px;"><br>
    <p>${fakeContent}</p>
    <button id="saveAIBookBtn">Save to My Books</button>
  `;
  document.getElementById('saveAIBookBtn').onclick = async () => {
    const { error } = await supabase.from('books').insert([{ title: fakeTitle, content: fakeContent, cover: fakeCover }]);
    aiBookResult.innerHTML = error ? error.message : 'AI Book saved!';
    if (!error) {
      showSection(sectionDashboard);
      fetchBooks();
    }
  };
};

// On load, show home
showSection(sectionHome);
