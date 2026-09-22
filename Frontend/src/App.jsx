import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams, Navigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import './App.css'

// === ΔΩΜΑΤΙΟ: ΑΡΧΙΚΗ ΣΕΛΙΔΑ (HOME) ===
function Home({ t }) {
  return (
    <div className="home-container">
      <div className="home-hero">
        
        {/* ΙΔΙΟ ΣΤΥΛ ΜΕ ΤΟ LOGO ΜΑΣ */}
        <h1 style={{ color: 'var(--text-color)' }}>
          {t('homeWelcome').split('DriverPass')[0]}
          
          <span style={{ fontWeight: 'bold' }}>
            <span style={{ color: 'var(--secondary-color)' }}>Driver</span>
            <span style={{ color: 'var(--text-color)' }}>Pass</span>
            <span style={{ 
              backgroundColor: '#a3d9b1', 
              color: 'white', 
              borderRadius: '4px', 
              padding: '2px 6px', 
              fontSize: '0.45em', 
              marginLeft: '5px', 
              verticalAlign: 'middle',
              position: 'relative',
              top: '-2px'
            }}>CY</span>
          </span>

          {t('homeWelcome').split('DriverPass')[1]}
        </h1>
        
        <p>{t('homeSubtitle')}</p>
      </div>

      <div className="gateways-wrapper">
        {/* Gateway: Μελέτη */}
        <Link to="/study" className="gateway-link">
          <div className="modern-card gateway-card">
            <div className="gateway-icon">📖</div>
            <h2 className="gateway-title">{t('studyCardTitle')}</h2>
            <p className="gateway-desc">{t('studyCardDesc')}</p>
            <div className="modern-button btn-secondary">{t('startStudyBtn')}</div>
          </div>
        </Link>

        {/* Gateway: Quiz */}
        <Link to="/quiz" className="gateway-link">
          <div className="modern-card gateway-card">
            <div className="gateway-icon">🚦</div>
            <h2 className="gateway-title">{t('quizCardTitle')}</h2>
            <p className="gateway-desc">{t('quizCardDesc')}</p>
            <div className="modern-button btn-secondary">{t('startQuizBtn')}</div>
          </div>
        </Link>
      </div>
    </div>
  );
}

// === ΔΩΜΑΤΙΟ: ΜΕΛΕΤΗ ===
function StudyRoom({ t, signs, categories }) {
  const [selectedCategory, setSelectedCategory] = useState(1);
  const filteredSigns = signs.filter(sign => String(sign.categoryId) === String(selectedCategory) || String(sign.CategoryId) === String(selectedCategory));

  return (
    <div>
      <div className="room-header">
        <h2>{t('listTitle')}</h2>
        <Link to="/" className="modern-button btn-outline">{t('backBtn')}</Link>
      </div>

      <div className="category-filters">
        {categories.map(category => (
          <button 
            key={category.id} 
            className={`modern-button category-btn ${String(selectedCategory) === String(category.id) ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {t(`category_${category.id}_title`, category.title || category.name)}
          </button>
        ))}
      </div>
      
      {filteredSigns.length === 0 ? (
        <p className="no-data-text">{t('noSignsInCategory', 'Δεν υπάρχουν σήματα.')}</p>
      ) : (
        <div className="signs-grid">
          {filteredSigns.map(sign => (
            <div key={sign.id} className="modern-card">
              <img src={sign.imageUrl} alt={sign.title} className="sign-img" />
              <h3 className="sign-title">{t(`sign_${sign.id}_title`, sign.title)}</h3>
              <p className="sign-desc">{t(`sign_${sign.id}_desc`, sign.description)}</p>
            </div>
          ))}
        </div>
      )}
        {/* Κουμπί: Προς τα πάνω */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '40px', paddingBottom: '20px' }}>
          <button 
          className="modern-button btn-outline" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
          {t('toTopBtn')}
          </button>
        </div>
    </div>
  )
}

// === ΔΩΜΑΤΙΟ: ΕΠΙΛΟΓΗ QUIZ ===
function QuizMenu({ t, categories }) {
  const navigate = useNavigate();
  return (
    <div>
      <div className="room-header">
        <h2 style={{ color: 'var(--text-color)' }}>{t('quizMenuTitle')}</h2>
        <Link to="/" className="modern-button btn-outline">{t('backBtn')}</Link>
      </div>

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <div className="modern-card quiz-type-card" style={{ margin: '0 auto' }} onClick={() => navigate('/quiz/select-type/master')}>
          <h2 style={{ color: 'var(--text-color)', marginBottom: '10px' }}>🏆 {t('masterQuizTitle')}</h2>
          <p style={{ color: 'var(--text-color)', opacity: 0.8 }}>{t('masterQuizDesc')}</p>
        </div>

        <h3 style={{ marginTop: '40px', color: 'var(--secondary-color)' }}>{t('categoriesTitle')}</h3>
        
        {categories.length === 0 ? <p>{t('loading')}</p> : (
          <div className="categories-grid">
            {categories.map(category => (
              <button 
                key={category.id} 
                className="modern-button category-btn" 
                onClick={() => navigate(`/quiz/select-type/category/${category.id}`)}
              >
                {t(`category_${category.id}_title`, category.title || category.name)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// === ΔΩΜΑΤΙΟ: ΕΠΙΛΟΓΗ ΤΥΠΟΥ ΕΞΕΤΑΣΗΣ ===
function QuizTypeSelection({ t }) {
  const navigate = useNavigate();
  const { mode, id } = useParams(); 

  return (
    <div>
      <div className="room-header">
        <h2 style={{ color: 'var(--text-color)' }}>{t('quizTypeTitle')}</h2>
        <button className="modern-button btn-outline" onClick={() => navigate('/quiz')}>{t('backBtn')}</button>
      </div>

      <div className="quiz-types-wrapper">
        <div className="modern-card quiz-type-card" onClick={() => navigate(`/quiz/play/${mode}/type1/${id || ''}`)}>
          <h2 style={{ color: 'var(--text-color)' }}>{t('type1Title')}</h2>
          <p style={{ color: 'var(--text-color)', opacity: 0.8 }}>{t('type1Desc')}</p>
        </div>

        <div className="modern-card quiz-type-card type2" onClick={() => navigate(`/quiz/play/${mode}/type2/${id || ''}`)}>
          <h2 style={{ color: 'var(--text-color)' }}>{t('type2Title')}</h2>
          <p style={{ color: 'var(--text-color)', opacity: 0.8 }}>{t('type2Desc')}</p>
        </div>
      </div>
    </div>
  )
}

// === ΔΩΜΑΤΙΟ: ΠΑΙΧΝΙΔΙ QUIZ ===
function QuizPlay({ t, signs }) {
  const navigate = useNavigate();
  const { mode, type, id } = useParams();

  const [questions, setQuestions] = useState(() => JSON.parse(sessionStorage.getItem('quizQuestions')) || []);
  const [currentIndex, setCurrentIndex] = useState(() => parseInt(sessionStorage.getItem('quizIndex')) || 0);
  const [score, setScore] = useState(() => parseInt(sessionStorage.getItem('quizScore')) || 0);
  const [selectedAnswer, setSelectedAnswer] = useState(() => JSON.parse(sessionStorage.getItem('quizSelectedAnswer')) || null);
  const [isAnswered, setIsAnswered] = useState(() => JSON.parse(sessionStorage.getItem('quizIsAnswered')) || false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Χρονόμετρο
  const [timeLeft, setTimeLeft] = useState(15);

  // Για το Leaderboard
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(false);

  // Μνήμη για τις λάθος απαντήσεις
  const [wrongAnswers, setWrongAnswers] = useState(() => JSON.parse(sessionStorage.getItem('quizWrongAnswers')) || []);

  // Φόρτωση Ερωτήσεων
  useEffect(() => {
    if (signs.length === 0) return;
    if (questions.length > 0) return; // Αν υπάρχουν ήδη ερωτήσεις, σταμάτα!
    let pool = [...signs];
    if (mode === 'category' && id) {
      pool = signs.filter(s => String(s.categoryId) === String(id) || String(s.CategoryId) === String(id));
    }
    if (pool.length === 0) {
      setErrorMsg(t('noSignsInQuizCategory', 'Αυτή η κατηγορία δεν έχει ακόμα σήματα!'));
      return;
    }
    const quizSigns = pool.sort(() => 0.5 - Math.random()).slice(0, 10);
    const generatedQuestions = quizSigns.map(correctSign => {
      let wrongChoices = signs.filter(s => s.id !== correctSign.id);
      wrongChoices = wrongChoices.sort(() => 0.5 - Math.random()).slice(0, 3);
      const options = [correctSign, ...wrongChoices].sort(() => 0.5 - Math.random());
      return { correct: correctSign, options: options };
    });
    setQuestions(generatedQuestions);
    sessionStorage.setItem('quizQuestions', JSON.stringify(generatedQuestions)); // Αποθήκευση των ερωτήσεων στη μνήμη
  }, [signs, mode, id, t, questions.length]);

// Αυτόματη αποθήκευση της προόδου στο sessionStorage
  useEffect(() => {
    if (questions.length > 0) {
      sessionStorage.setItem('quizIndex', currentIndex);
      sessionStorage.setItem('quizScore', score);
      sessionStorage.setItem('quizWrongAnswers', JSON.stringify(wrongAnswers));
      sessionStorage.setItem('quizIsAnswered', JSON.stringify(isAnswered));
      sessionStorage.setItem('quizSelectedAnswer', JSON.stringify(selectedAnswer));
    }
  }, [currentIndex, score, wrongAnswers, questions.length, isAnswered, selectedAnswer]);

  // Λογική Χρονομέτρου
  useEffect(() => {
    // Αν έχει απαντήσει ή έχει τελειώσει το quiz, σταματάμε το χρονόμετρο
    if (isAnswered || questions.length === 0 || currentIndex >= questions.length) return;

    // Αν μηδενίσει ο χρόνος, πιάνεται ως λάθος
    if (timeLeft === 0) {
      handleAnswerClick({ id: 'timeout' }); // Στέλνουμε μια ψεύτικη (λάθος) απάντηση
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswered, currentIndex, questions.length]);

  // Φόρτωση Leaderboard όταν τελειώνει το Quiz
  useEffect(() => {
    if (currentIndex >= questions.length && questions.length > 0) {
      setIsLeaderboardLoading(true);
      const categoryParam = mode === 'category' ? `&categoryId=${id}` : '';
      
      fetch(`http://localhost:5220/api/UserResults/leaderboard?mode=${mode}${categoryParam}`)
        .then(res => res.json())
        .then(data => {
          setLeaderboard(data);
          setIsLeaderboardLoading(false);
        })
        .catch(err => {
          console.error("Leaderboard fetch error:", err);
          setIsLeaderboardLoading(false);
        });
    }
  }, [currentIndex, questions.length, mode, id]);

  const saveScoreToDb = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return; 

    const finalScorePercent = Math.round((score / questions.length) * 100);

    try {
      await fetch('http://localhost:5220/api/UserResults', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score: finalScorePercent,
          userId: parseInt(userId),
          quizMode: mode, 
          categoryId: mode === 'category' ? parseInt(id) : null 
        })
      });
    } catch (error) {
      console.error("Σφάλμα αποθήκευσης σκορ:", error);
    }
  };

  const handleNext = async () => {
    // Καταγραφή Λάθους
    if (selectedAnswer?.id === 'timeout') {
      // Αν είναι timeout, το καταγράφουμε αμέσως ως null
      setWrongAnswers(prev => [...prev, { correct: currentQuestion.correct, wrong: null }]);
    } else if (selectedAnswer && selectedAnswer.id !== currentQuestion.correct.id) {
      // Αν επέλεξε λάθος σήμα
      setWrongAnswers(prev => [...prev, { correct: currentQuestion.correct, wrong: selectedAnswer }]);
    }
    setIsAnswered(false);
    setSelectedAnswer(null);
    setTimeLeft(15); // Επαναφορά χρονομέτρου στα 15s για την επόμενη ερώτηση
    
    if (currentIndex === questions.length - 1) {
      await saveScoreToDb();
    }
    
    setCurrentIndex(currentIndex + 1);
  };

  if (errorMsg) return (<div style={{ textAlign: 'center', marginTop: '50px' }}><h3 style={{ color: 'var(--primary-color)' }}>{errorMsg}</h3><button className="modern-button" onClick={() => navigate('/quiz')}>{t('backBtn')}</button></div>);
  if (questions.length === 0) return <p style={{ textAlign: 'center' }}>{t('loading')}</p>;

  // Οθόνη Τέλους (Αποτελέσματα & Leaderboard)
  if (currentIndex >= questions.length) {
    return (
      <div className="modern-card quiz-results-card" style={{ marginTop: '50px' }}>
        <h2 style={{ color: 'var(--primary-color)', fontSize: '35px' }}> {t('quizOver')}</h2>
        <p>{t('finalScore')} <strong style={{color: 'var(--secondary-color)', fontSize: '23px'}}>{score} / {questions.length}</strong></p>
        
        <div style={{ marginBottom: '30px' }}>
          <button className="modern-button" onClick={() => { sessionStorage.clear(); // Καθαρισμός μνήμης
          setCurrentIndex(0); setScore(0); setIsAnswered(false); setSelectedAnswer(null); setTimeLeft(15); setWrongAnswers([]); setQuestions([]);}}>{t('restartBtn')}</button>
          <button className="modern-button btn-outline" style={{ marginLeft: '10px' }} onClick={() => { sessionStorage.clear(); // Καθαρισμός μνήμης
          navigate('/quiz'); }}>{t('backBtn')}</button>
        </div>

{/* --- ΛΙΣΤΑ ΜΕ ΛΑΘΗ --- */}
        {wrongAnswers.length > 0 && (
          <div className="mistakes-container">
            <h3 className="mistakes-title">{t('mistakesTitle')}</h3>
            <div className="mistakes-list">
              {wrongAnswers.map((item, idx) => (
                <div key={idx} className="mistake-item">
                  <img src={item.correct.imageUrl} alt="Sign" className="mistake-img" />
                  <div className="mistake-details">
                    <p style={{ margin: '0 0 5px 0', fontSize: '18px', color: 'var(--text-color)' }}>
                      <strong style={{ fontSize: '18px' }}>{t('correctWas')}</strong> {t(`sign_${item.correct.id}_title`, item.correct.title)}
                    </p>
                    <p style={{ margin: 0, fontSize: '17px', color: '#888' }}>
                      <em>{t('youChose')} {item.wrong ? t(`sign_${item.wrong.id}_title`, item.wrong.title) : t('timeOutMistake')}</em>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- LEADERBOARD --- */}
        <div className="leaderboard-section">
          <h3>{t('leaderboardTitle')}</h3>
          {isLeaderboardLoading ? (
            <p>{t('loading')}</p>
          ) : leaderboard.length === 0 ? (
            <p style={{ color: 'var(--text-color)', opacity: 0.8 }}>{t('noScoresYet')}</p>
          ) : (
            <ul className="leaderboard-list">
              {leaderboard.map((entry, idx) => (
                <li key={idx} className={idx < 3 ? 'top-three' : ''}>
                  <span className="rank">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`}
                  </span>
                  <span className="username">{entry.username}</span>
                  <span className="score">{entry.score}%</span>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  
  const handleAnswerClick = (answer) => {
    if (isAnswered) return; 
    setSelectedAnswer(answer);
    setIsAnswered(true);

    // Ήχοι
    if (answer.id === currentQuestion.correct.id) {
      setScore(score + 1);
      new Audio('/correct.mp3').play().catch(e => console.log("Audio play error", e));
    } else {
      new Audio('/wrong.mp3').play().catch(e => console.log("Audio play error", e));
    }
  };

  const getAnswerClass = (optionId) => {
    if (!isAnswered) return '';
    if (optionId === currentQuestion.correct.id) return 'correct';
    if (optionId === selectedAnswer?.id) return 'wrong';
    return '';
  };

  return (
    <div className="quiz-play-container">
      <div className="quiz-info-header" style={{ fontSize: '20px' }}>
        <span>{t('question')}: {currentIndex + 1} / {questions.length}</span>
        <span>{t('score')}: {score}</span>
      </div>

      <div className="modern-card" style={{ padding: '25px' }}>
        {/* Χρονόμετρο */}
        {!isAnswered && <div className="quiz-timer-text">⏳ {timeLeft}s</div>}

        {type === 'type1' && (
          <div>
            <img src={currentQuestion.correct.imageUrl} alt="Sign" style={{ width: '160px', height: '160px', objectFit: 'contain', margin: '0 auto 20px auto', display: 'block' }} />
            <div className="quiz-options-col">
              {currentQuestion.options.map(option => (
                <button 
                  key={option.id} 
                  className={`modern-button answer-btn ${getAnswerClass(option.id)}`}
                  onClick={() => handleAnswerClick(option)}
                >
                  {t(`sign_${option.id}_title`, option.title)}
                </button>
              ))}
            </div>
          </div>
        )}

        {type === 'type2' && (
          <div>
            <h2 className="quiz-big-title">
              {t(`sign_${currentQuestion.correct.id}_title`, currentQuestion.correct.title)}
            </h2>
            <div className="quiz-options-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px' }}>
              {currentQuestion.options.map(option => (
                <div 
                  key={option.id} 
                  className={`modern-card quiz-img-option ${getAnswerClass(option.id)}`} 
                  style={{ padding: '30px' }}
                  onClick={() => handleAnswerClick(option)}
                >
                  <img src={option.imageUrl} alt="Option" style={{ width: '150px', height: '150px' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {isAnswered && (
          <button className="modern-button btn-secondary btn-block" style={{ marginTop: '20px', fontSize: '20px', padding: '12px' }} onClick={handleNext}>
            {currentIndex === questions.length - 1 ? t('finishBtn') : t('nextBtn')}
          </button>
        )}
      </div>
    </div>
  )
}

// === ΔΩΜΑΤΙΟ: ΕΓΓΡΑΦΗ ΧΡΗΣΤΗ (REGISTER) ===
function RegisterScreen({ t }) {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:5220/api/Users/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
      });
      if (response.ok) setIsRegistered(true);
      else {
        const errorCode = await response.text();
        setError(t(errorCode));
          }
    } catch (err) {
      setError(t('serverError', 'Πρόβλημα σύνδεσης με τον διακομιστή.'));
    }
  };

  return (
    <div className="auth-container">
      {!isRegistered ? (
        <div className="modern-card auth-card">
          <h2 className="auth-title">{t('registerSubmit')}</h2>
            <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
              <input type="text" autoComplete="off" placeholder={t('usernamePlaceholder')} required className="auth-input" onChange={(e) => setFormData({...formData, username: e.target.value})} />
              <input type="email" autoComplete="off" placeholder={t('emailPlaceholder')} required className="auth-input" onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <input type="password" autoComplete="new-password" placeholder={t('passwordPlaceholder')} required className="auth-input" onChange={(e) => setFormData({...formData, password: e.target.value})} />
              {error && <div style={{ color: 'red', textAlign: 'center', fontWeight: 'bold' }}>{error}</div>}
             <button type="submit" className="modern-button btn-block">{t('registerSubmit')}</button>
          </form>
          <div className="auth-footer">
            <p style={{ marginBottom: '10px' }}>{t('hasAccount')}</p>
            <Link to="/login" className="auth-link">{t('loginLink')}</Link>
          </div>
        </div>
      ) : (
        /* --- ΕΜΦΑΝΙΣΗ ΚΥΠΡΙΑΚΗΣ ΑΔΕΙΑΣ ΟΔΗΓΗΣΗΣ --- */
        <div className="license-success-card">
          <div className="license-header">
            <div>
              <h3>{t('licenseCountry', 'ΚΥΠΡΙΑΚΗ ΔΗΜΟΚΡΑΤΙΑ')}</h3>
              <p>{t('licenseTitle', 'Άδεια Οδήγησης - Μαθητευόμενος')}</p>
            </div>
            <div className="cy-badge">CY</div>
          </div>
          
          <div className="license-body">
            <div className="license-photo">👤</div>
            <div className="license-details">
              <p><strong>1. ({t('licenseUsername', 'Όνομα')}):</strong> {formData.username}</p>
              <p><strong>3. ({t('licenseDate', 'Ημερομηνία')}):</strong> {new Date().toLocaleDateString()}</p>
              <p><strong>9. ({t('licenseCategories', 'Κατηγορίες')}):</strong> B, B1 ({t('licensePassenger', 'Επιβατικά')})</p>
            </div>
          </div>
          
          <p className="license-success-msg">
            {t('success_register', 'Επιτυχής Εγγραφή!')}
          </p>

          <button className="modern-button btn-block" onClick={() => navigate('/login')}>
            {t('loginLink')}
          </button>
        </div>
      )}
    </div>
  );
}

// === ΔΩΜΑΤΙΟ: ΣΥΝΔΕΣΗ ΧΡΗΣΤΗ (LOGIN) ===
function LoginScreen({ t, setIsLoggedIn }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:5220/api/Users/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', data.id); 
        setIsLoggedIn(true);
        navigate('/');       
      } else {
        const errorCode = await response.text();
        setError(t(errorCode));
      }
    } catch (err) {
      setError(t('serverError', 'Πρόβλημα σύνδεσης με τον διακομιστή.'));
    }
  };

  return (
    <div className="auth-container">
      <div className="modern-card auth-card">
        <h2 className="auth-title">{t('loginTitle')}</h2>
        <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
          <input type="text" autoComplete="off" placeholder={t('usernamePlaceholder')} required className="auth-input" onChange={(e) => setFormData({...formData, username: e.target.value})} />
          <input type="password" autoComplete="new-password" placeholder={t('passwordPlaceholder')} required className="auth-input" onChange={(e) => setFormData({...formData, password: e.target.value})} />
          
          {/* --- "ΞΕΧΑΣΑ ΤΟΝ ΚΩΔΙΚΟ" --- */}
          <div style={{ textAlign: 'right', marginTop: '5px', marginBottom: '15px' }}>
            <Link to="/forgot-password" style={{ color: 'var(--secondary-color)', fontSize: '13px', textDecoration: 'none', fontWeight: 'bold', transition: 'opacity 0.2s' }}>
              {t('forgotPassword')}
            </Link>
          </div>
          {error && <div style={{ color: 'red', textAlign: 'center', fontWeight: 'bold' }}>{error}</div>}
          <button type="submit" className="modern-button btn-block">{t('loginSubmit')}</button>
        </form>
        <div className="auth-footer">
          <p style={{ marginBottom: '10px' }}>{t('noAccount')}</p>
          <Link to="/register" className="auth-link">{t('createAccountLink')}</Link>
        </div>
      </div>
    </div>
  );
}

// === ΔΩΜΑΤΙΟ: ΞΕΧΑΣΑ ΤΟΝ ΚΩΔΙΚΟ (FORGOT PASSWORD) ===
function ForgotPasswordScreen({ t }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:5220/api/Users/forgot-password', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setIsSubmitted(true);
        setMessage(t('forgotPasswordSuccess'));
      } else {
        const errorCode = await response.text();
        setError(t(errorCode));
      }
    } catch (err) {
      setError(t('serverError'));
    }
  };

  return (
    <div className="auth-container">
      <div className="modern-card auth-card">
        <h2 className="auth-title">{t('forgotPasswordTitle')}</h2>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
            <p className="forgot-password-desc">
              {t('forgotPasswordDesc')}
            </p>
            <input 
              type="email" 
              autoComplete="off" 
              placeholder={t('emailPlaceholder')} 
              required 
              className="auth-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
            />
            {error && <div className="auth-error-msg">{error}</div>}
            
            <button type="submit" className="modern-button btn-block">
              {t('sendBtn')}
            </button>
          </form>
        ) : (
          <div className="forgot-password-success-container">
            <div className="forgot-password-icon">✉️</div>
            <p className="forgot-password-success-msg">
              {t('forgotPasswordSuccess')}
            </p>
          </div>
        )}

        <div className="auth-footer">
          <Link to="/login" className="auth-link">
            ← {t('backToLogin')}
          </Link>
        </div>
      </div>
    </div>
  );
}

// === ΔΩΜΑΤΙΟ: ΔΗΜΙΟΥΡΓΙΑ ΝΕΟΥ ΚΩΔΙΚΟΥ (RESET PASSWORD) ===
function ResetPasswordScreen({ t }) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Διαβάζει το token από το URL
  const navigate = useNavigate();
  
  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (passwords.newPassword !== passwords.confirmPassword) {
      return setError(t('passwordsDoNotMatch', 'Οι κωδικοί δεν ταιριάζουν.'));
    }

    try {
      const response = await fetch('http://localhost:5220/api/Users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token, newPassword: passwords.newPassword })
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        const errorCode = await response.text();
        setError(t(errorCode, 'Μη έγκυρο ή ληγμένο link.'));
      }
    } catch (err) {
      setError(t('serverError', 'Πρόβλημα σύνδεσης.'));
    }
  };

if (!token) {
    return <div className="auth-container"><h2 style={{color: 'red'}}>{t('missingTokenError', 'Σφάλμα: Λείπει το Token!')}</h2></div>;
  }

  return (
    <div className="auth-container">
      <div className="modern-card auth-card">
        <h2 className="auth-title">{t('resetPasswordTitle', 'Νέος Κωδικός')}</h2>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
            <input 
              type="password" 
              autoComplete="new-password" 
              placeholder={t('newPasswordPlaceholder', 'Νέος Κωδικός')} 
              required 
              className="auth-input" 
              onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} 
            />
            <input 
              type="password" 
              autoComplete="new-password" 
              placeholder={t('confirmPasswordPlaceholder', 'Επιβεβαίωση Κωδικού')} 
              required 
              className="auth-input" 
              onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})} 
            />
            {error && <div className="auth-error-msg">{error}</div>}
            
            <button type="submit" className="modern-button btn-block">
              {t('saveNewPasswordBtn', 'Αποθήκευση')}
            </button>
          </form>
        ) : (
          <div className="forgot-password-success-container">
            <div className="forgot-password-icon">✅</div>
            <p className="forgot-password-success-msg">
              {t('passwordChangedSuccess', 'Ο κωδικός σου άλλαξε με επιτυχία!')}
            </p>
            <button className="modern-button btn-block" style={{marginTop: '20px'}} onClick={() => navigate('/login')}>
              {t('loginLink', 'Σύνδεση')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// === ΔΩΜΑΤΙΟ: ΤΟ ΠΡΟΦΙΛ ΜΟΥ ===
function ProfileScreen({ t, categories }) {
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`http://localhost:5220/api/Users/${userId}`)
        .then(res => res.json())
        .then(data => setUserData(data))
        .catch(err => console.error("Πρόβλημα φόρτωσης προφίλ:", err));
    }
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-paper">
        <div className="profile-badge">L</div>
        <h2 className="profile-title" style={{ color: '#333' }}>{t('profileBtn')}</h2>
        
        <div className="profile-info">
          <p><strong>{t('profileName')}</strong> {userData ? userData.username : <em>{t('profileLoading')}</em>}</p>
          
          <div className="profile-master-stats">
            <p><strong>{t('profileTotalQuizzes')}</strong> {userData ? userData.totalQuizzes : 0}</p>
            <p><strong>{t('profileAverageTotal')}</strong> {userData ? userData.averageScore + '%' : '0%'}</p>
          </div>

          {/* Στατιστικά Επίσημης Εξέτασης */}
          <div className="profile-master-stats">
            <p className="profile-master-title"><strong>{t('profileMasterTitle')}</strong></p>
            <p className="profile-stat-item">{t('profileAttempts')} <strong>{userData ? userData.masterAttempts : 0}</strong></p>
            <p className="profile-stat-item">
              {t('profileSuccesses')} <strong className={userData?.masterPasses > 0 ? 'success-text' : ''}>{userData ? userData.masterPasses : 0}</strong>
            </p>
          </div>

          {/* Προτάσεις Επανάληψης */}
          <div className="profile-recommendations">
            {userData && userData.weakCategories && userData.weakCategories.length > 0 ? (
              <div className="weak-categories-box">
                <strong>{t('profileWeaknessWarning')}</strong>
                <ul className="weak-categories-list">
                  {userData.weakCategories.map(cid => {
                    const cat = categories.find(c => String(c.id) === String(cid));
                    return <li key={cid}>{cat ? t(`category_${cid}_title`, cat.title || cat.name) : t('profileCategoryFallback') + cid}</li>;
                  })}
                </ul>
              </div>
            ) : (
              <p className="no-weakness-msg">{t('profileNoWeaknessMsg')}</p>
            )}
          </div>
        </div>

        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <p style={{ fontStyle: 'italic', borderTop: '1px solid #ccc', paddingTop: '15px', marginBottom: '25px' }}>{t('profileQuote')}</p>
          <div className="profile-actions">
            <Link to="/study" className="modern-button">{t('goForStudyBtn')}</Link>
            <Link to="/quiz" className="modern-button">{t('goForQuizBtn')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// === ΟΘΟΝΗ: ΠΛΗΡΟΦΟΡΙΕΣ & ΝΟΜΙΚΑ ΕΓΓΡΑΦΑ ===
function InfoScreen({ t }) {
  const { pageType } = useParams();
  const navigate = useNavigate();

  let titleKey = "";
  let textKey = "";

  if (pageType === 'about') { titleKey = 'menuAbout'; textKey = 'aboutText'; }
  else if (pageType === 'privacy') { titleKey = 'menuPrivacy'; textKey = 'privacyText'; }
  else if (pageType === 'terms') { titleKey = 'menuTerms'; textKey = 'termsText'; }
  else if (pageType === 'cookies') { titleKey = 'menuCookies'; textKey = 'cookiesText'; }
  else if (pageType === 'help') { titleKey = 'menuHelp'; textKey = 'helpText'; }

  return (
    <div className="info-screen-container">
      <div className="info-screen-header">
        <button className="modern-button btn-outline" onClick={() => navigate('/')}>
          {t('backBtn')}
        </button>
      </div>
      
      <div className="modern-card info-page-card">
        <h2 className="info-page-title">{t(titleKey)}</h2>
        <p className="info-page-content">{t(textKey)}</p>
      </div>
    </div>
  );
}

function App() {
  const [signs, setSigns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark'); // Το γράφει στη μνήμη
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light'); // Το γράφει στη μνήμη
    }
  }, [isDarkMode]);

  useEffect(() => {
    fetch('http://localhost:5220/api/TrafficSigns')
      .then(res => res.json())
      .then(data => setSigns(data))
      .catch(err => console.error(err));

    fetch('http://localhost:5220/api/Categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error(err));
  }, []);

  // ΑΥΤΟΜΑΤΗ ΑΛΛΑΓΗ ΚΑΤΕΥΘΥΝΣΗΣ ΓΙΑ ΑΡΑΒΙΚΑ (RTL)
  useEffect(() => {
    document.body.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return (
    <BrowserRouter>
      <div className="app-container">
        
        {/* ΣΥΡΤΑΡΩΤΟ ΜΕΝΟΥ */}
        {isSettingsOpen && <div className="sidebar-overlay" onClick={() => setIsSettingsOpen(false)}></div>}
        <div className={`sidebar ${isSettingsOpen ? 'open' : ''}`}>
          <button className="sidebar-close" onClick={() => setIsSettingsOpen(false)}>✖</button>
          <h2>{t('settings')}</h2>
          
          <div className="settings-section">
            <div className="settings-item">
              <label>{t('account')}</label>
              {isLoggedIn ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Link to="/profile" className="modern-button btn-secondary" onClick={() => setIsSettingsOpen(false)}>{t('profileBtn')}</Link>
                  <button className="modern-button btn-secondary" onClick={() => { setIsLoggedIn(false); setIsSettingsOpen(false); localStorage.removeItem('isLoggedIn'); localStorage.removeItem('userId'); }}>{t('logoutBtn')}</button>
                </div>
              ) : (
                <Link to="/login" className="modern-button btn-block" onClick={() => setIsSettingsOpen(false)}>{t('loginRegisterBtn')}</Link>
              )}
            </div>

            <div className="settings-item">
              <label>{t('appearance')}</label>
              <button className="modern-button" onClick={() => setIsDarkMode(!isDarkMode)}>
                {isDarkMode ? t('lightModeBtn') : t('darkModeBtn')}
              </button>
            </div>
            
            <div className="settings-item">
              <label>{t('language')}</label>
              <select className="modern-select" value={i18n.language} onChange={(e) => i18n.changeLanguage(e.target.value)}>
                <option value="el">Ελληνικά (Greek)</option>
                <option value="en">English (Αγγλικά)</option>
                <option value="tr">Türkçe (Τουρκικά)</option>
                <option value="ru">Русский (Ρωσικά)</option>
                <option value="ro">Română (Ρουμανικά)</option>
                <option value="bg">Български (Βουλγαρικά)</option>
                <option value="ar">العربية (Αραβικά)</option>
              </select>
            </div>

      {/* ΥΠΟΣΤΗΡΙΞΗ & ΝΟΜΙΚΑ */}
      <div className="sidebar-section-divider"></div>
         <p className="sidebar-section-title">{t('legalSectionTitle')}</p>
          
        <Link to="/info/about" className="sidebar-legal-btn" style={{ textDecoration: 'none', display: 'block' }} onClick={() => setIsSidebarOpen(false)}>
          {t('menuAbout')}
        </Link>
        
        <Link to="/info/privacy" className="sidebar-legal-btn" style={{ textDecoration: 'none', display: 'block' }} onClick={() => setIsSidebarOpen(false)}>
          {t('menuPrivacy')}
        </Link>
        
        <Link to="/info/terms" className="sidebar-legal-btn" style={{ textDecoration: 'none', display: 'block' }} onClick={() => setIsSidebarOpen(false)}>
          {t('menuTerms')}
        </Link>
        
        <Link to="/info/cookies" className="sidebar-legal-btn" style={{ textDecoration: 'none', display: 'block' }} onClick={() => setIsSidebarOpen(false)}>
          {t('menuCookies')}
        </Link>
        
        <Link to="/info/help" className="sidebar-legal-btn" style={{ textDecoration: 'none', display: 'block' }} onClick={() => setIsSidebarOpen(false)}>
          {t('menuHelp')}
        </Link>

        {/* Μικρό Copyright στο τέλος του Sidebar */}
        <div className="sidebar-copyright">
           © 2026 DriverPass CY
        </div>

          </div>
        </div>

        {/* HEADER */}
        <div className="app-header">
          <button className="hamburger-btn" onClick={() => setIsSettingsOpen(true)}>☰</button>
          <div className="brand-logo">
            <span><span className="brand-highlight">Driver</span>Pass</span>
            <span className="cy-badge">CY</span>
          </div>
        </div>

        {/* ΔΡΟΜΟΛΟΓΗΣΗ (ROUTES) */}
        <Routes>
          <Route path="/" element={isLoggedIn ? <Home t={t} /> : <Navigate to="/login" />} />
          <Route path="/study" element={isLoggedIn ? <StudyRoom t={t} signs={signs} categories={categories} /> : <Navigate to="/login" />} />
          <Route path="/quiz" element={isLoggedIn ? <QuizMenu t={t} categories={categories} /> : <Navigate to="/login" />} />
          <Route path="/quiz/select-type/:mode/:id?" element={isLoggedIn ? <QuizTypeSelection t={t} /> : <Navigate to="/login" />} />
          <Route path="/quiz/play/:mode/:type/:id?" element={isLoggedIn ? <QuizPlay t={t} signs={signs} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isLoggedIn ? <ProfileScreen t={t} categories={categories} /> : <Navigate to="/login" />} />

          <Route path="/info/:pageType" element={<InfoScreen t={t} />} />
          <Route path="/register" element={<RegisterScreen t={t} />} />
          <Route path="/login" element={<LoginScreen t={t} setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/forgot-password" element={<ForgotPasswordScreen t={t} />} />
          <Route path="/reset-password" element={<ResetPasswordScreen t={t} />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App