import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, ArrowRight, CheckCircle, Mic, MicOff, Volume2, Square } from 'lucide-react';

export default function Room() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [interimText, setInterimText] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await api.get(`/interviews/${id}`);
        setInterview(res.data.data);
      } catch (err) {
        console.error('Failed to load interview session:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterview();

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      window.speechSynthesis?.cancel();
    };
  }, [id]);

  // Stop active voice recording/speech when switching questions
  useEffect(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setInterimText('');
    }
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, [currentIndex]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-text-primary">Loading session...</div>;
  if (!interview) return <div className="min-h-screen bg-background flex items-center justify-center text-text-primary">Interview not found.</div>;

  const currentQ = interview.questions[currentIndex];

  const handleAnswerChange = (e) => {
    setAnswers({
      ...answers,
      [currentQ.questionId]: e.target.value
    });
  };

  const toggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in this browser. Please use Google Chrome.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setInterimText('');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      setInterimText(interimTranscript);

      if (finalTranscript) {
        setAnswers((prev) => {
          const existing = prev[currentQ.questionId] || '';
          const separator = existing && !existing.endsWith(' ') ? ' ' : '';
          return {
            ...prev,
            [currentQ.questionId]: existing + separator + finalTranscript.trim()
          };
        });
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setInterimText('');
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimText('');
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const toggleReadQuestion = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentQ.questionText);
    utterance.lang = 'en-IN';
    utterance.rate = 1;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = async () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    window.speechSynthesis?.cancel();

    if (!window.confirm('Are you sure you want to submit your answers?')) return;
    setSubmitting(true);
    try {
      const formattedAnswers = interview.questions.map(q => ({
        questionId: q.questionId,
        userAnswer: answers[q.questionId] || ''
      }));
      await api.post(`/interviews/${id}/submit`, { answers: formattedAnswers });
      navigate(`/results/${id}`);
    } catch (err) {
      console.error('Failed to submit interview:', err);
      alert('Error submitting interview. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary p-6 flex flex-col justify-between">
      {/* Top Bar */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <span className="text-xs text-text-secondary uppercase tracking-wider">{interview.category} • {interview.difficulty}</span>
          <h2 className="text-xl font-bold">Mock Session</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-highlight">Question {currentIndex + 1} of {interview.questions.length}</span>
        </div>
      </header>

      {/* Main Question & Answer Editor */}
      <main className="max-w-4xl mx-auto w-full my-8 flex-1">
        <div className="bg-card-bg border border-white/10 p-8 rounded-2xl mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h3 className="text-2xl font-bold">{currentQ?.questionText}</h3>
            <button
              type="button"
              onClick={toggleReadQuestion}
              title={isSpeaking ? 'Stop reading' : 'Read question aloud'}
              className={`shrink-0 px-3 py-2 rounded-xl border text-sm font-medium flex items-center gap-2 transition-all ${
                isSpeaking
                  ? 'bg-highlight/20 border-highlight text-highlight'
                  : 'bg-secondary-bg border-white/10 text-text-secondary hover:text-text-primary'
              }`}
            >
              {isSpeaking ? <><Square className="w-4 h-4" /> Stop</> : <><Volume2 className="w-4 h-4" /> Listen</>}
            </button>
          </div>

          {/* Voice Assistance Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all ${
                isListening
                  ? 'bg-red-500/20 border border-red-500 text-red-400 animate-pulse'
                  : 'bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4" /> Stop Speaking
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" /> Speak Answer
                </>
              )}
            </button>

            {isListening && (
              <span className="text-xs text-red-400">
                Listening... {interimText && <em className="text-text-secondary">"{interimText}"</em>}
              </span>
            )}
          </div>

          <textarea
            value={answers[currentQ?.questionId] || ''}
            onChange={handleAnswerChange}
            placeholder="Type your structured answer here or click 'Speak Answer' to dictate..."
            className="w-full h-64 bg-secondary-bg border border-white/10 rounded-xl p-4 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-primary transition-all resize-none text-base"
          />
        </div>
      </main>

      {/* Navigation & Controls */}
      <footer className="max-w-4xl mx-auto w-full flex items-center justify-between border-t border-white/10 pt-4">
        <button
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(currentIndex - 1)}
          className="px-6 py-3 rounded-xl bg-card-bg border border-white/10 text-text-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Previous
        </button>

        {currentIndex === interview.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-8 py-3 rounded-xl bg-success text-background font-bold flex items-center gap-2 shadow-lg shadow-success/20 hover:opacity-90"
          >
            {submitting ? 'Evaluating...' : 'Submit Interview'} <CheckCircle className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={() => setCurrentIndex(currentIndex + 1)}
            className="px-6 py-3 rounded-xl bg-primary text-white font-semibold flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </footer>
    </div>
  );
}
