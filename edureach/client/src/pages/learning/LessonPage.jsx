import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Sparkles, BookOpen, Play, HelpCircle, X } from 'lucide-react';

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

// ─── Section wrapper ────────────────────────────────────────
const Section = ({ children, style, id }) => (
    <motion.section
        id={id}
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #E2E8F0',
            padding: '36px 32px',
            marginBottom: '28px',
            scrollMarginTop: '100px',
            ...style,
        }}
    >
        {children}
    </motion.section>
);

// ─── Sidebar nav items ──────────────────────────────────────
const sidebarItems = [
    { id: 'lesson-content', label: 'Lesson Content', icon: BookOpen },
    { id: 'videos', label: 'Videos', icon: Play },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
];

const SectionTitle = ({ emoji, children }) => (
    <h2 style={{
        fontSize: '22px',
        fontWeight: 700,
        color: '#0F172A',
        margin: '0 0 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
        {emoji && <span style={{ fontSize: '24px' }}>{emoji}</span>}
        {children}
    </h2>
);

// ─── Numbers data ───────────────────────────────────────────
const numbersData = [
    { num: 1, word: 'One', color: '#EF4444' },
    { num: 2, word: 'Two', color: '#F97316' },
    { num: 3, word: 'Three', color: '#EAB308' },
    { num: 4, word: 'Four', color: '#22C55E' },
    { num: 5, word: 'Five', color: '#14B8A6' },
    { num: 6, word: 'Six', color: '#3B82F6' },
    { num: 7, word: 'Seven', color: '#6366F1' },
    { num: 8, word: 'Eight', color: '#A855F7' },
    { num: 9, word: 'Nine', color: '#EC4899' },
    { num: 10, word: 'Ten', color: '#F43F5E' },
];

const appleExamples = [
    { count: 1, text: '1 apple' },
    { count: 2, text: '2 apples' },
    { count: 3, text: '3 apples' },
    { count: 4, text: '4 apples' },
    { count: 5, text: '5 apples' },
];

// ─── Lesson Data ──────────────────────────────────────────────
const lessonData = {
    'counting-numbers': {
        title: 'Counting Numbers (1–10)',
        subtitle: 'Learn how to count numbers from 1 to 10 using simple examples and fun activities.',
        videoSubtitle: 'Watch these fun videos to learn more about counting numbers from 1 to 10! Click a video to watch it in full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/Yt8GFgxlITs?si=7DaSC5QLcjIiR9h9', title: 'Counting Numbers Video 1', thumb: 'https://img.youtube.com/vi/Yt8GFgxlITs/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/9SmaA6ErWKE?si=VshrN0piMBlOCz-X', title: 'Counting Numbers Video 2', thumb: 'https://img.youtube.com/vi/9SmaA6ErWKE/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/6g_fjnW77Fs?si=s27mYRMPJaZKFz8l', title: 'Counting Numbers Video 3', thumb: 'https://img.youtube.com/vi/6g_fjnW77Fs/hqdefault.jpg' },
        ],
        quiz: [
            { question: 'How many apples are there?', visual: '🍎 🍎 🍎', options: ['2', '3', '4'], correct: 1 },
            { question: 'How many stars are there?', visual: '⭐ ⭐ ⭐ ⭐ ⭐', options: ['4', '5', '6'], correct: 1 },
            { question: 'Which number comes after 3?', visual: '1, 2, 3, ?', options: ['4', '5', '2'], correct: 0 },
            { question: 'How many bananas are there?', visual: '🍌 🍌 🍌 🍌 🍌 🍌', options: ['5', '6', '7'], correct: 1 },
            { question: 'Which number comes before 5?', visual: '?, 5', options: ['3', '4', '6'], correct: 1 },
            { question: 'How many hearts are there?', visual: '❤️ ❤️', options: ['1', '2', '3'], correct: 1 },
            { question: 'Count the flowers!', visual: '🌸 🌸 🌸 🌸 🌸 🌸 🌸', options: ['6', '7', '8'], correct: 1 },
            { question: 'What number is between 7 and 9?', visual: '7, ?, 9', options: ['6', '8', '10'], correct: 1 },
            { question: 'How many fish are there?', visual: '🐟 🐟 🐟 🐟 🐟 🐟 🐟 🐟 🐟', options: ['8', '9', '10'], correct: 1 },
            { question: 'Which is the biggest number?', visual: '3, 7, 10', options: ['3', '7', '10'], correct: 2 },
        ],
        summary: [
            'Numbers help us count objects.',
            'We use numbers from 1 to 10 to count small quantities.',
            'Counting helps us know the exact amount.'
        ],
        summaryEnd: 'Great job! You are learning how to count numbers from 1 to 10!',
        nextLesson: { id: 'counting-objects', title: 'Counting Objects' }
    },
    'counting-objects': {
        title: 'Counting Objects',
        subtitle: 'Learn how to count different objects around you.',
        videoSubtitle: 'Watch these fun videos to learn how to count objects! Click a video to watch it in full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/MBPhqzWw0xY?si=CBgAx8He_Pfkl8xA', title: 'Counting Objects Video 1', thumb: 'https://img.youtube.com/vi/MBPhqzWw0xY/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/n8HaVIegUpc?si=HLkU2b2DumJkyvBK', title: 'Counting Objects Video 2', thumb: 'https://img.youtube.com/vi/n8HaVIegUpc/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/mKSNQuQrsm0?si=HhH4x-F_eJaO7mxC', title: 'Counting Objects Video 3', thumb: 'https://img.youtube.com/vi/mKSNQuQrsm0/hqdefault.jpg' }
        ],
        quiz: [
            { question: 'How many apples are there?', visual: '🍎 🍎 🍎 🍎', options: ['3', '4', '5'], correct: 1 },
            { question: 'How many stars are there?', visual: '⭐ ⭐ ⭐', options: ['2', '3', '4'], correct: 1 },
            { question: 'How many cars are there?', visual: '🚗 🚗 🚗 🚗 🚗', options: ['4', '5', '6'], correct: 1 },
            { question: 'How many balloons are there?', visual: '🎈 🎈 🎈 🎈 🎈 🎈', options: ['5', '6', '7'], correct: 1 },
            { question: 'How many dogs are there?', visual: '🐶 🐶', options: ['1', '2', '3'], correct: 1 },
            { question: 'How many trees are there?', visual: '🌲 🌲 🌲 🌲 🌲 🌲 🌲', options: ['6', '7', '8'], correct: 1 },
            { question: 'How many footballs are there?', visual: '⚽ ⚽ ⚽ ⚽ ⚽ ⚽ ⚽ ⚽', options: ['8', '9', '10'], correct: 0 },
            { question: 'How many birds are there?', visual: '🐦 🐦 🐦 🐦 🐦 🐦 🐦 🐦 🐦', options: ['8', '9', '10'], correct: 1 },
            { question: 'How many suns are there?', visual: '☀️ ☀️ ☀️ ☀️ ☀️ ☀️ ☀️ ☀️ ☀️ ☀️', options: ['8', '9', '10'], correct: 2 },
            { question: 'How many cats are there?', visual: '🐱', options: ['1', '2', '3'], correct: 0 },
        ],
        summary: [
            'Counting helps us know how many objects there are.',
            'We can count apples, stars, cars, and other objects.',
            'Counting objects helps us understand numbers better.'
        ],
        summaryEnd: 'Great job! You are learning how to count objects!',
        nextLesson: { id: 'addition', title: 'Addition' }
    },
    'addition': {
        title: 'Addition',
        subtitle: 'Learn how to add numbers using simple examples and objects.',
        videoSubtitle: 'Watch these fun videos to learn basic addition for kids! Click to watch them in full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/VScM8Z8Jls0?si=uz01rjWubMWyj9Lg', title: 'Addition Video 1', thumb: 'https://img.youtube.com/vi/VScM8Z8Jls0/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/G0Di8DP9f8w?si=PBxiuEt0rnU8JTh7', title: 'Addition Video 2', thumb: 'https://img.youtube.com/vi/G0Di8DP9f8w/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/mjlsSYLLOSE?si=WGyY0S0EamWxueUM', title: 'Addition Video 3', thumb: 'https://img.youtube.com/vi/mjlsSYLLOSE/hqdefault.jpg' }
        ],
        quiz: [
            { question: '2 + 1 = ?', visual: '2 + 1', options: ['2', '3', '4'], correct: 1 },
            { question: '🍎 🍎 + 🍎 = ?', visual: '🍎 🍎 + 🍎', options: ['2', '3', '4'], correct: 1 },
            { question: '⭐ ⭐ + ⭐ ⭐ = ?', visual: '⭐ ⭐ + ⭐ ⭐', options: ['3', '4', '5'], correct: 1 },
            { question: '3 + 2 = ?', visual: '3 + 2', options: ['4', '5', '6'], correct: 1 },
            { question: '🚗 + 🚗 🚗 = ?', visual: '🚗 + 🚗 🚗', options: ['2', '3', '4'], correct: 1 },
            { question: '4 + 0 = ?', visual: '4 + 0', options: ['3', '4', '5'], correct: 1 },
            { question: '🎈 🎈 + 🎈 🎈 = ?', visual: '🎈 🎈 + 🎈 🎈', options: ['3', '4', '5'], correct: 1 },
            { question: '1 + 4 = ?', visual: '1 + 4', options: ['4', '5', '6'], correct: 1 },
            { question: '🐶 🐶 🐶 + 🐶 = ?', visual: '🐶 🐶 🐶 + 🐶', options: ['3', '4', '5'], correct: 1 },
            { question: '5 + 5 = ?', visual: '5 + 5', options: ['8', '9', '10'], correct: 2 }
        ],
        summary: [
            'Addition means putting numbers together',
            'We can add objects like apples and stars',
            'Adding numbers helps us find the total'
        ],
        summaryEnd: 'Great job! You are learning addition!',
        nextLesson: { id: 'subtraction', title: 'Subtraction' }
    },
    'subtraction': {
        title: 'Subtraction',
        subtitle: 'Learn how to subtract numbers using simple examples and objects.',
        videoSubtitle: 'Watch these fun videos to learn basic subtraction for kids! Click to watch them in full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/ZygCUtAUWJA?si=N5iRTSTNljzI-7Va', title: 'Subtraction Video 1', thumb: 'https://img.youtube.com/vi/ZygCUtAUWJA/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/YLPbduEc4sA?si=5oaig4nOGKGhu7yJ', title: 'Subtraction Video 2', thumb: 'https://img.youtube.com/vi/YLPbduEc4sA/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/lBfj-pm5kqc?si=IeoWjc99-DLWxNB1', title: 'Subtraction Video 3', thumb: 'https://img.youtube.com/vi/lBfj-pm5kqc/hqdefault.jpg' }
        ],
        quiz: [
            { question: '5 − 2 = ?', visual: '5 − 2', options: ['2', '3', '4'], correct: 1 },
            { question: '🍎 🍎 🍎 🍎 − 🍎 = ?', visual: '🍎 🍎 🍎 🍎 − 🍎', options: ['2', '3', '4'], correct: 1 },
            { question: '⭐ ⭐ ⭐ − ⭐ = ?', visual: '⭐ ⭐ ⭐ − ⭐', options: ['1', '2', '3'], correct: 1 },
            { question: '4 − 2 = ?', visual: '4 − 2', options: ['1', '2', '3'], correct: 1 },
            { question: '🚗 🚗 🚗 🚗 🚗 − 🚗 🚗 = ?', visual: '🚗 🚗 🚗 🚗 🚗 − 🚗 🚗', options: ['2', '3', '4'], correct: 1 },
            { question: '3 − 0 = ?', visual: '3 − 0', options: ['2', '3', '4'], correct: 1 },
            { question: '🎈 🎈 🎈 − 🎈 🎈 = ?', visual: '🎈 🎈 🎈 − 🎈 🎈', options: ['1', '2', '3'], correct: 0 },
            { question: '6 − 3 = ?', visual: '6 − 3', options: ['2', '3', '4'], correct: 1 },
            { question: '🐶 🐶 🐶 🐶 − 🐶 🐶 🐶 = ?', visual: '🐶 🐶 🐶 🐶 − 🐶 🐶 🐶', options: ['1', '2', '3'], correct: 0 },
            { question: '10 − 5 = ?', visual: '10 − 5', options: ['4', '5', '6'], correct: 1 }
        ],
        summary: [
            'Subtraction means taking away objects',
            'Subtracting numbers makes the total smaller',
            'We can subtract apples, stars, and other objects'
        ],
        summaryEnd: 'Great job! You are learning subtraction!',
        nextLesson: { id: 'shapes', title: 'Shapes' }
    },
    'shapes': {
        title: 'Shapes',
        subtitle: 'Learn about basic shapes like circle, square, triangle, and rectangle.',
        videoSubtitle: 'Watch these fun videos to learn about shapes for kids! Click to watch them in full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/jlzX8jt0Now?si=H0iR9g89LVLGJ0v0', title: 'Shapes Video 1', thumb: 'https://img.youtube.com/vi/jlzX8jt0Now/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/o-6OKWU99Co?si=MG42fKzc7hypVNMp', title: 'Shapes Video 2', thumb: 'https://img.youtube.com/vi/o-6OKWU99Co/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/bJzZJi5z-2E?si=mssOcNVTYy2FWvO3', title: 'Shapes Video 3', thumb: 'https://img.youtube.com/vi/bJzZJi5z-2E/hqdefault.jpg' }
        ],
        quiz: [
            { question: 'Which shape is round?', visual: '🔵', options: ['Circle', 'Square', 'Triangle'], correct: 0 },
            { question: 'Which shape has three sides?', visual: '🔺', options: ['Triangle', 'Circle', 'Rectangle'], correct: 0 },
            { question: 'Which shape looks like a book or TV?', visual: '📱', options: ['Rectangle', 'Circle', 'Square'], correct: 0 },
            { question: 'What shape is a pizza slice?', visual: '🍕', options: ['Square', 'Triangle', 'Circle'], correct: 1 },
            { question: 'What shape has four equal sides?', visual: '🟥', options: ['Rectangle', 'Triangle', 'Square'], correct: 2 },
            { question: 'Which shape is like a wheel?', visual: '🛞', options: ['Circle', 'Square', 'Triangle'], correct: 0 },
            { question: 'What shape is a window usually?', visual: '🪟', options: ['Circle', 'Square', 'Triangle'], correct: 1 },
            { question: 'What shape is a door?', visual: '🚪', options: ['Rectangle', 'Circle', 'Triangle'], correct: 0 },
            { question: 'Which shape has NO straight sides?', visual: '⭕', options: ['Square', 'Rectangle', 'Circle'], correct: 2 },
            { question: 'What shape is a slice of watermelon?', visual: '🍉', options: ['Circle', 'Rectangle', 'Triangle'], correct: 2 }
        ],
        summary: [
            'What shapes are',
            'Basic shapes like circle, square, triangle, and rectangle',
            'How shapes appear in objects around us'
        ],
        summaryEnd: 'Great job! You are learning shapes!',
        nextLesson: { id: 'maths-practice', title: 'Practice Maths Skills' }
    }
};

const LessonPage = () => {
    const { classId, subjectId, chapterId } = useParams();
    const navigate = useNavigate();

    // Quiz state
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);

    // Active section tracking for sidebar
    const [activeSection, setActiveSection] = useState('lesson-content');

    useEffect(() => {
        const sectionIds = ['lesson-content', 'videos', 'quiz'];
        const observers = [];

        sectionIds.forEach((id) => {
            const el = document.getElementById(id);
            if (!el) return;
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActiveSection(id);
                    }
                },
                { rootMargin: '-100px 0px -60% 0px', threshold: 0 }
            );
            observer.observe(el);
            observers.push(observer);
        });

        return () => observers.forEach(o => o.disconnect());
    }, []);

    const handleAnswer = (qIndex, oIndex) => {
        if (showResults) return;
        setAnswers(prev => ({ ...prev, [qIndex]: oIndex }));
    };

    const handleSubmitQuiz = () => {
        setShowResults(true);
    };

    const score = Object.keys(answers).reduce((acc, key) => {
        if (!lessonData[chapterId]) return 0;
        return acc + (answers[key] === lessonData[chapterId].quiz[key].correct ? 1 : 0);
    }, 0);

    const currentLesson = lessonData[chapterId];

    if (!currentLesson) {
        // Fallback for other chapters
        return (
            <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: '68px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
                    <button
                        onClick={() => navigate(`/learning/class/${classId}/subject/${subjectId}`)}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px',
                            padding: '10px 20px', fontSize: '14px', fontWeight: 600, color: '#475569',
                            cursor: 'pointer', marginBottom: '32px',
                        }}
                    >
                        <ArrowLeft size={16} /> Back to Chapters
                    </button>
                    <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '48px 32px', textAlign: 'center' }}>
                        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0F172A', marginBottom: '12px' }}>
                            {chapterId?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </h1>
                        <p style={{ fontSize: '16px', color: '#64748B' }}>
                            Lesson content for this chapter is coming soon!
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: '#F8FAFC',
            paddingTop: '68px',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Back Button — above the flex row */}
            <div style={{ maxWidth: '1160px', width: '100%', margin: '0 auto', padding: '24px 24px 0' }}>
                <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate(`/learning/class/${classId}/subject/${subjectId}`)}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px',
                        padding: '10px 20px', fontSize: '14px', fontWeight: 600, color: '#475569',
                        cursor: 'pointer', marginBottom: '16px', transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#F1F5F9'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#FFFFFF'; }}
                >
                    <ArrowLeft size={16} />
                    Back to Maths Skills
                </motion.button>
            </div>

            {/* Flex row: Sidebar + Main Content */}
            <div style={{
                flex: 1,
                maxWidth: '1160px',
                width: '100%',
                margin: '0 auto',
                padding: '0 24px',
                display: 'flex',
                gap: '32px',
                alignItems: 'flex-start',
            }}>
                {/* ─── STICKY SIDEBAR ─── */}
                <motion.nav
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{
                        position: 'sticky',
                        top: '100px',
                        width: '220px',
                        minWidth: '220px',
                        background: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid #E2E8F0',
                        padding: '20px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                    }}
                >
                    <div style={{
                        fontSize: '11px', fontWeight: 700, color: '#94A3B8',
                        textTransform: 'uppercase', letterSpacing: '1.5px',
                        padding: '0 12px 10px', borderBottom: '1px solid #F1F5F9',
                        marginBottom: '6px',
                    }}>
                        Navigation
                    </div>
                    {sidebarItems.map((item) => {
                        const isActive = activeSection === item.id;
                        const Icon = item.icon;
                        return (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    padding: '12px 14px', borderRadius: '12px',
                                    fontSize: '14px', fontWeight: isActive ? 700 : 500,
                                    color: isActive ? '#2563EB' : '#64748B',
                                    background: isActive ? '#EFF6FF' : 'transparent',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s ease',
                                    border: isActive ? '1px solid #BFDBFE' : '1px solid transparent',
                                }}
                                onMouseEnter={e => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = '#F8FAFC';
                                        e.currentTarget.style.color = '#334155';
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = '#64748B';
                                    }
                                }}
                            >
                                <Icon size={16} />
                                {item.label}
                            </a>
                        );
                    })}
                </motion.nav>

                {/* ─── MAIN CONTENT ─── */}
                <div style={{ flex: 1, minWidth: 0, paddingBottom: '24px' }}>

                    {/* ──────────── 1. HEADER ──────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            textAlign: 'center',
                            marginBottom: '40px',
                        }}
                    >
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            background: '#FEF3C7', color: '#B45309', fontSize: '13px', fontWeight: 700,
                            letterSpacing: '1px', textTransform: 'uppercase', padding: '8px 20px',
                            borderRadius: '50px', marginBottom: '18px',
                        }}>
                            📐 Class {classId} • Maths
                        </div>
                        <h1 style={{
                            fontSize: 'clamp(28px, 5vw, 42px)',
                            fontWeight: 800, color: '#0F172A', margin: '0 0 14px',
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}>
                            {currentLesson.title}
                        </h1>
                        <p style={{
                            fontSize: '17px', color: '#64748B', maxWidth: '560px',
                            margin: '0 auto', lineHeight: 1.7,
                        }}>
                            {currentLesson.subtitle}
                        </p>
                    </motion.div>

                    {/* ──────────── LESSON CONTENT SECTION ──────────── */}
                    <div id="lesson-content" style={{ scrollMarginTop: '100px' }} />

                    {/* ──────────── LESSON CONTENT MODULES ──────────── */}
                    {chapterId === 'counting-numbers' && (
                        <>
                            {/* ──────────── 2. EXPLANATION ──────────── */}
                            <Section>
                                <SectionTitle emoji="📖">What Are Numbers?</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    Numbers help us <strong>count objects</strong>. We use numbers to know <strong>how many things</strong> are there.
                                </p>
                                <div style={{
                                    background: '#FFF7ED', borderRadius: '14px', padding: '20px 24px',
                                    borderLeft: '4px solid #FB923C',
                                }}>
                                    <p style={{ fontSize: '15px', fontWeight: 600, color: '#9A3412', margin: '0 0 10px' }}>Example:</p>
                                    <div style={{ fontSize: '20px', lineHeight: 2 }}>
                                        <div>🍎 = <strong>1</strong> apple</div>
                                        <div>🍎 🍎 = <strong>2</strong> apples</div>
                                        <div>🍎 🍎 🍎 = <strong>3</strong> apples</div>
                                    </div>
                                </div>
                            </Section>

                            {/* ──────────── 3. NUMBERS LIST ──────────── */}
                            <Section>
                                <SectionTitle emoji="🔢">Numbers from 1 to 10</SectionTitle>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(5, 1fr)',
                                    gap: '14px',
                                }}>
                                    {numbersData.map(({ num, word, color }) => (
                                        <motion.div
                                            key={num}
                                            whileHover={{ scale: 1.05, y: -3 }}
                                            style={{
                                                background: `${color}10`,
                                                border: `2px solid ${color}30`,
                                                borderRadius: '16px',
                                                padding: '18px 12px',
                                                textAlign: 'center',
                                                cursor: 'default',
                                                transition: 'all 0.2s',
                                            }}
                                        >
                                            <div style={{
                                                fontSize: '36px', fontWeight: 800, color: color,
                                                fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1,
                                            }}>
                                                {num}
                                            </div>
                                            <div style={{
                                                fontSize: '13px', fontWeight: 600, color: '#64748B',
                                                marginTop: '6px',
                                            }}>
                                                {word}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </Section>

                            {/* ──────────── 4. VISUAL EXAMPLE ──────────── */}
                            <Section>
                                <SectionTitle emoji="🍎">Counting Example</SectionTitle>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {appleExamples.map(({ count, text }) => (
                                        <div key={count} style={{
                                            display: 'flex', alignItems: 'center', gap: '16px',
                                            background: '#FEF2F2', borderRadius: '12px', padding: '14px 20px',
                                        }}>
                                            <span style={{ fontSize: '28px', letterSpacing: '4px' }}>
                                                {'🍎 '.repeat(count).trim()}
                                            </span>
                                            <span style={{
                                                fontSize: '16px', fontWeight: 600, color: '#991B1B',
                                            }}>
                                                = {text}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div style={{
                                    marginTop: '16px', background: '#ECFDF5', borderRadius: '12px',
                                    padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '10px',
                                }}>
                                    <span style={{ fontSize: '20px' }}>💡</span>
                                    <span style={{ fontSize: '15px', fontWeight: 600, color: '#065F46' }}>
                                        There are 5 apples! Can you count them?
                                    </span>
                                </div>
                            </Section>

                            {/* ──────────── 5. PRACTICE ──────────── */}
                            <Section style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
                                <SectionTitle emoji="✏️">Let's Practice Counting</SectionTitle>
                                <div style={{
                                    background: '#FFFFFF', borderRadius: '16px', padding: '28px 24px',
                                    textAlign: 'center', border: '1px solid #FDE68A',
                                }}>
                                    <div style={{ fontSize: '48px', letterSpacing: '12px', marginBottom: '16px' }}>
                                        ⭐ ⭐ ⭐ ⭐
                                    </div>
                                    <p style={{ fontSize: '18px', fontWeight: 600, color: '#92400E', marginBottom: '12px' }}>
                                        How many stars are there?
                                    </p>
                                    <div style={{
                                        display: 'inline-block', background: '#D1FAE5', borderRadius: '12px',
                                        padding: '12px 24px',
                                    }}>
                                        <span style={{ fontSize: '16px', fontWeight: 700, color: '#065F46' }}>
                                            ✅ Answer: There are <strong>4</strong> stars!
                                        </span>
                                    </div>
                                </div>
                            </Section>
                        </>
                    )}

                    {chapterId === 'counting-objects' && (
                        <>
                            {/* ──────────── WHAT IS COUNTING ──────────── */}
                            <Section>
                                <SectionTitle emoji="🤔">What is Counting?</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    Counting means finding <strong>how many objects</strong> are there.
                                </p>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    We count things around us every day such as apples, toys, stars, and books. Explanation below shows how counting helps us know the exact number of objects.
                                </p>
                                <div style={{
                                    background: '#F8FAFC', borderRadius: '14px', padding: '20px 24px',
                                    borderLeft: '4px solid #3B82F6',
                                }}>
                                    <p style={{ fontSize: '15px', fontWeight: 600, color: '#1E40AF', margin: '0 0 10px' }}>Example:</p>
                                    <div style={{ fontSize: '20px', lineHeight: 2 }}>
                                        <div>🍎 = <strong>1</strong> apple</div>
                                        <div>🍎 🍎 = <strong>2</strong> apples</div>
                                        <div>🍎 🍎 🍎 = <strong>3</strong> apples</div>
                                    </div>
                                </div>
                            </Section>

                            {/* ──────────── OBJECT COUNTING EXAMPLES ──────────── */}
                            <Section>
                                <SectionTitle emoji="👀">Let's Count Objects</SectionTitle>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '20px',
                                        background: '#FEF2F2', borderRadius: '12px', padding: '16px 24px',
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#991B1B', marginBottom: '8px' }}>Example 1</p>
                                            <div style={{ fontSize: '32px', letterSpacing: '6px' }}>🍎 🍎 🍎 🍎</div>
                                        </div>
                                        <div style={{ fontSize: '18px', fontWeight: 600, color: '#7F1D1D' }}>There are 4 apples.</div>
                                    </div>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '20px',
                                        background: '#FFFBEB', borderRadius: '12px', padding: '16px 24px',
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#92400E', marginBottom: '8px' }}>Example 2</p>
                                            <div style={{ fontSize: '32px', letterSpacing: '6px' }}>⭐ ⭐ ⭐</div>
                                        </div>
                                        <div style={{ fontSize: '18px', fontWeight: 600, color: '#78350F' }}>There are 3 stars.</div>
                                    </div>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '20px',
                                        background: '#EFF6FF', borderRadius: '12px', padding: '16px 24px',
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#1E40AF', marginBottom: '8px' }}>Example 3</p>
                                            <div style={{ fontSize: '32px', letterSpacing: '6px' }}>🚗 🚗 🚗 🚗 🚗</div>
                                        </div>
                                        <div style={{ fontSize: '18px', fontWeight: 600, color: '#1E3A8A' }}>There are 5 cars.</div>
                                    </div>
                                </div>
                            </Section>

                            {/* ──────────── PRACTICE ──────────── */}
                            <Section style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                                <SectionTitle emoji="✋">Practice Counting</SectionTitle>
                                <div style={{
                                    background: '#FFFFFF', borderRadius: '16px', padding: '32px 24px',
                                    textAlign: 'center', border: '1px solid #BBF7D0',
                                }}>
                                    <div style={{ fontSize: '48px', letterSpacing: '12px', marginBottom: '16px' }}>
                                        🐶 🐶 🐶 🐶
                                    </div>
                                    <p style={{ fontSize: '20px', fontWeight: 600, color: '#166534', marginBottom: '16px' }}>
                                        How many dogs are there?
                                    </p>
                                    <div style={{
                                        display: 'inline-block', background: '#DCFCE7', borderRadius: '12px',
                                        padding: '14px 28px',
                                    }}>
                                        <span style={{ fontSize: '18px', fontWeight: 700, color: '#14532D' }}>
                                            ✅ Answer: There are <strong>4</strong> dogs.
                                        </span>
                                    </div>
                                </div>
                            </Section>
                        </>
                    )}

                    {chapterId === 'addition' && (
                        <>
                            {/* ──────────── WHAT IS ADDITION ──────────── */}
                            <Section>
                                <SectionTitle emoji="➕">What is Addition?</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    <strong>Addition</strong> means putting numbers together to find the total.
                                </p>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    When we add numbers, the result becomes bigger. Addition helps us count things when we combine them.
                                </p>
                                <div style={{
                                    background: '#F0FDF4', borderRadius: '14px', padding: '20px 24px',
                                    borderLeft: '4px solid #22C55E', textAlign: 'center'
                                }}>
                                    <p style={{ fontSize: '15px', fontWeight: 600, color: '#166534', margin: '0 0 10px' }}>Example:</p>
                                    <div style={{ fontSize: '32px', fontWeight: 800, color: '#14532D', letterSpacing: '4px' }}>
                                        2 + 1 = 3
                                    </div>
                                </div>
                            </Section>

                            {/* ──────────── ADDITION EXAMPLES ──────────── */}
                            <Section>
                                <SectionTitle emoji="👀">Addition Examples</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    Adding objects together increases the total count. Let's see how!
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '20px',
                                        background: '#FEF2F2', borderRadius: '12px', padding: '16px 24px', flexWrap: 'wrap'
                                    }}>
                                        <div style={{ flex: '1 1 auto' }}>
                                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#991B1B', marginBottom: '8px' }}>Example 1</p>
                                            <div style={{ fontSize: '32px', letterSpacing: '4px' }}>🍎 🍎 + 🍎</div>
                                        </div>
                                        <div style={{ fontSize: '18px', fontWeight: 600, color: '#7F1D1D' }}>2 apples + 1 apple = 3 apples</div>
                                    </div>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '20px',
                                        background: '#FFFBEB', borderRadius: '12px', padding: '16px 24px', flexWrap: 'wrap'
                                    }}>
                                        <div style={{ flex: '1 1 auto' }}>
                                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#92400E', marginBottom: '8px' }}>Example 2</p>
                                            <div style={{ fontSize: '32px', letterSpacing: '4px' }}>⭐ ⭐ ⭐ + ⭐</div>
                                        </div>
                                        <div style={{ fontSize: '18px', fontWeight: 600, color: '#78350F' }}>3 stars + 1 star = 4 stars</div>
                                    </div>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '20px',
                                        background: '#EFF6FF', borderRadius: '12px', padding: '16px 24px', flexWrap: 'wrap'
                                    }}>
                                        <div style={{ flex: '1 1 auto' }}>
                                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#1E40AF', marginBottom: '8px' }}>Example 3</p>
                                            <div style={{ fontSize: '32px', letterSpacing: '4px' }}>🚗 🚗 + 🚗 🚗</div>
                                        </div>
                                        <div style={{ fontSize: '18px', fontWeight: 600, color: '#1E3A8A' }}>2 cars + 2 cars = 4 cars</div>
                                    </div>
                                </div>
                            </Section>

                            {/* ──────────── PRACTICE ──────────── */}
                            <Section style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                                <SectionTitle emoji="✏️">Let's Practice Addition</SectionTitle>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                                    <div style={{
                                        background: '#FFFFFF', borderRadius: '16px', padding: '32px 24px',
                                        textAlign: 'center', border: '1px solid #E2E8F0',
                                    }}>
                                        <div style={{ fontSize: '48px', letterSpacing: '12px', marginBottom: '16px' }}>
                                            🍎 🍎 + 🍎
                                        </div>
                                        <p style={{ fontSize: '20px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>
                                            How many apples are there in total?
                                        </p>
                                        <div style={{
                                            display: 'inline-block', background: '#DCFCE7', borderRadius: '12px',
                                            padding: '14px 28px',
                                        }}>
                                            <span style={{ fontSize: '18px', fontWeight: 700, color: '#14532D' }}>
                                                ✅ Answer: <strong>3</strong> apples
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{
                                        background: '#FFFFFF', borderRadius: '16px', padding: '32px 24px',
                                        textAlign: 'center', border: '1px solid #E2E8F0',
                                    }}>
                                        <div style={{ fontSize: '48px', letterSpacing: '12px', marginBottom: '16px' }}>
                                            ⭐ ⭐ + ⭐ ⭐
                                        </div>
                                        <p style={{ fontSize: '20px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>
                                            How many stars are there in total?
                                        </p>
                                        <div style={{
                                            display: 'inline-block', background: '#DCFCE7', borderRadius: '12px',
                                            padding: '14px 28px',
                                        }}>
                                            <span style={{ fontSize: '18px', fontWeight: 700, color: '#14532D' }}>
                                                ✅ Answer: <strong>4</strong> stars
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Section>
                        </>
                    )}

                    {chapterId === 'subtraction' && (
                        <>
                            {/* ──────────── WHAT IS SUBTRACTION ──────────── */}
                            <Section>
                                <SectionTitle emoji="➖">What is Subtraction?</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    <strong>Subtraction</strong> means taking away some objects from a group.
                                </p>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    When we subtract numbers, the total becomes smaller. Subtraction helps us know how many objects remain after taking some away.
                                </p>
                                <div style={{
                                    background: '#FEF2F2', borderRadius: '14px', padding: '20px 24px',
                                    borderLeft: '4px solid #EF4444', textAlign: 'center'
                                }}>
                                    <p style={{ fontSize: '15px', fontWeight: 600, color: '#991B1B', margin: '0 0 10px' }}>Example:</p>
                                    <div style={{ fontSize: '32px', fontWeight: 800, color: '#7F1D1D', letterSpacing: '4px' }}>
                                        5 − 2 = 3
                                    </div>
                                </div>
                            </Section>

                            {/* ──────────── SUBTRACTION EXAMPLES ──────────── */}
                            <Section>
                                <SectionTitle emoji="👀">Subtraction Examples</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    Subtraction helps us find how many objects are left. Let's see some examples!
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '20px',
                                        background: '#FEF2F2', borderRadius: '12px', padding: '16px 24px', flexWrap: 'wrap'
                                    }}>
                                        <div style={{ flex: '1 1 auto' }}>
                                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#991B1B', marginBottom: '8px' }}>Example 1</p>
                                            <div style={{ fontSize: '32px', letterSpacing: '4px' }}>
                                                <span>🍎 🍎 🍎</span> <span style={{ textDecoration: 'line-through', textDecorationColor: '#EF4444', textDecorationThickness: '3px' }}>🍎 🍎</span>
                                            </div>
                                            <p style={{ fontSize: '14px', color: '#7F1D1D', margin: '8px 0 0' }}>Take away 2 apples. Remaining: 🍎 🍎 🍎</p>
                                        </div>
                                        <div style={{ fontSize: '18px', fontWeight: 600, color: '#7F1D1D' }}>5 apples − 2 apples = 3 apples</div>
                                    </div>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '20px',
                                        background: '#FFFBEB', borderRadius: '12px', padding: '16px 24px', flexWrap: 'wrap'
                                    }}>
                                        <div style={{ flex: '1 1 auto' }}>
                                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#92400E', marginBottom: '8px' }}>Example 2</p>
                                            <div style={{ fontSize: '32px', letterSpacing: '4px' }}>
                                                <span>⭐ ⭐ ⭐</span> <span style={{ textDecoration: 'line-through', textDecorationColor: '#F59E0B', textDecorationThickness: '3px' }}>⭐</span>
                                            </div>
                                            <p style={{ fontSize: '14px', color: '#78350F', margin: '8px 0 0' }}>Take away 1 star. Remaining: ⭐ ⭐ ⭐</p>
                                        </div>
                                        <div style={{ fontSize: '18px', fontWeight: 600, color: '#78350F' }}>4 stars − 1 star = 3 stars</div>
                                    </div>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '20px',
                                        background: '#EFF6FF', borderRadius: '12px', padding: '16px 24px', flexWrap: 'wrap'
                                    }}>
                                        <div style={{ flex: '1 1 auto' }}>
                                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#1E40AF', marginBottom: '8px' }}>Example 3</p>
                                            <div style={{ fontSize: '32px', letterSpacing: '4px' }}>
                                                <span>🚗 🚗</span> <span style={{ textDecoration: 'line-through', textDecorationColor: '#3B82F6', textDecorationThickness: '3px' }}>🚗</span>
                                            </div>
                                            <p style={{ fontSize: '14px', color: '#1E3A8A', margin: '8px 0 0' }}>Take away 1 car. Remaining: 🚗 🚗</p>
                                        </div>
                                        <div style={{ fontSize: '18px', fontWeight: 600, color: '#1E3A8A' }}>3 cars − 1 car = 2 cars</div>
                                    </div>
                                </div>
                            </Section>

                            {/* ──────────── PRACTICE ──────────── */}
                            <Section style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                                <SectionTitle emoji="✏️">Let's Practice Subtraction</SectionTitle>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                                    <div style={{
                                        background: '#FFFFFF', borderRadius: '16px', padding: '32px 24px',
                                        textAlign: 'center', border: '1px solid #E2E8F0',
                                    }}>
                                        <div style={{ fontSize: '48px', letterSpacing: '8px', marginBottom: '16px' }}>
                                            <span>🍎 🍎 🍎</span> <span style={{ textDecoration: 'line-through', textDecorationColor: '#EF4444', textDecorationThickness: '4px' }}>🍎</span>
                                        </div>
                                        <p style={{ fontSize: '16px', color: '#475569', marginBottom: '8px' }}>Take away 1 apple.</p>
                                        <p style={{ fontSize: '20px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>
                                            How many apples remain?
                                        </p>
                                        <div style={{
                                            display: 'inline-block', background: '#DCFCE7', borderRadius: '12px',
                                            padding: '14px 28px',
                                        }}>
                                            <span style={{ fontSize: '18px', fontWeight: 700, color: '#14532D' }}>
                                                ✅ Answer: <strong>3</strong> apples
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{
                                        background: '#FFFFFF', borderRadius: '16px', padding: '32px 24px',
                                        textAlign: 'center', border: '1px solid #E2E8F0',
                                    }}>
                                        <div style={{ fontSize: '48px', letterSpacing: '8px', marginBottom: '16px' }}>
                                            <span>⭐ ⭐ ⭐</span> <span style={{ textDecoration: 'line-through', textDecorationColor: '#F59E0B', textDecorationThickness: '4px' }}>⭐ ⭐</span>
                                        </div>
                                        <p style={{ fontSize: '16px', color: '#475569', marginBottom: '8px' }}>Take away 2 stars.</p>
                                        <p style={{ fontSize: '20px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>
                                            How many stars remain?
                                        </p>
                                        <div style={{
                                            display: 'inline-block', background: '#DCFCE7', borderRadius: '12px',
                                            padding: '14px 28px',
                                        }}>
                                            <span style={{ fontSize: '18px', fontWeight: 700, color: '#14532D' }}>
                                                ✅ Answer: <strong>3</strong> stars
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Section>
                        </>
                    )}

                    {chapterId === 'shapes' && (
                        <>
                            {/* ──────────── WHAT ARE SHAPES ──────────── */}
                            <Section>
                                <SectionTitle emoji="🔵">What Are Shapes?</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    <strong>Shapes</strong> are the forms of objects we see around us.
                                </p>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    Everything around us has a shape. For example, a ball is round, a book is rectangular, and a slice of pizza can look like a triangle. Learning shapes helps us understand the objects around us.
                                </p>
                            </Section>

                            {/* ──────────── COMMON SHAPES ──────────── */}
                            <Section>
                                <SectionTitle emoji="✨">Common Shapes</SectionTitle>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                                    {/* Circle */}
                                    <div style={{
                                        background: '#EFF6FF', borderRadius: '16px', padding: '24px',
                                        border: '1px solid #BFDBFE', textAlign: 'center'
                                    }}>
                                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔵</div>
                                        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1E3A8A', margin: '0 0 8px' }}>Circle</h3>
                                        <p style={{ fontSize: '15px', color: '#1E40AF', margin: 0 }}>Circle looks round like a ball. It has no straight sides.</p>
                                    </div>

                                    {/* Square */}
                                    <div style={{
                                        background: '#FEF2F2', borderRadius: '16px', padding: '24px',
                                        border: '1px solid #FECACA', textAlign: 'center'
                                    }}>
                                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🟥</div>
                                        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#991B1B', margin: '0 0 8px' }}>Square</h3>
                                        <p style={{ fontSize: '15px', color: '#B91C1C', margin: 0 }}>Square has four equal sides and four corners.</p>
                                    </div>

                                    {/* Triangle */}
                                    <div style={{
                                        background: '#FFFBEB', borderRadius: '16px', padding: '24px',
                                        border: '1px solid #FDE68A', textAlign: 'center'
                                    }}>
                                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔺</div>
                                        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#92400E', margin: '0 0 8px' }}>Triangle</h3>
                                        <p style={{ fontSize: '15px', color: '#B45309', margin: 0 }}>Triangle has three sides and three corners.</p>
                                    </div>

                                    {/* Rectangle */}
                                    <div style={{
                                        background: '#F0FDFA', borderRadius: '16px', padding: '24px',
                                        border: '1px solid #A7F3D0', textAlign: 'center'
                                    }}>
                                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>▭</div>
                                        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#065F46', margin: '0 0 8px' }}>Rectangle</h3>
                                        <p style={{ fontSize: '15px', color: '#047857', margin: 0 }}>Rectangle has four sides, with opposite sides being equal.</p>
                                    </div>
                                </div>
                            </Section>

                            {/* ──────────── SHAPES IN REAL LIFE ──────────── */}
                            <Section>
                                <SectionTitle emoji="🌍">Shapes in Real Life</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    Many objects around us have these shapes. Let's see some examples!
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '20px',
                                        background: '#F8FAFC', borderRadius: '12px', padding: '16px 24px',
                                        border: '1px solid #E2E8F0'
                                    }}>
                                        <div style={{ fontSize: '40px' }}>⚽</div>
                                        <div style={{ fontSize: '18px', fontWeight: 600, color: '#334155' }}>Ball → Circle</div>
                                    </div>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '20px',
                                        background: '#F8FAFC', borderRadius: '12px', padding: '16px 24px',
                                        border: '1px solid #E2E8F0'
                                    }}>
                                        <div style={{ fontSize: '40px' }}>📺</div>
                                        <div style={{ fontSize: '18px', fontWeight: 600, color: '#334155' }}>TV → Rectangle</div>
                                    </div>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '20px',
                                        background: '#F8FAFC', borderRadius: '12px', padding: '16px 24px',
                                        border: '1px solid #E2E8F0'
                                    }}>
                                        <div style={{ fontSize: '40px' }}>🪟</div>
                                        <div style={{ fontSize: '18px', fontWeight: 600, color: '#334155' }}>Window → Square</div>
                                    </div>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '20px',
                                        background: '#F8FAFC', borderRadius: '12px', padding: '16px 24px',
                                        border: '1px solid #E2E8F0'
                                    }}>
                                        <div style={{ fontSize: '40px' }}>🍕</div>
                                        <div style={{ fontSize: '18px', fontWeight: 600, color: '#334155' }}>Pizza → Triangle</div>
                                    </div>
                                </div>
                            </Section>

                            {/* ──────────── PRACTICE ──────────── */}
                            <Section style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                                <SectionTitle emoji="✏️">Let's Practice Identifying Shapes</SectionTitle>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>

                                    <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
                                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔵</div>
                                        <p style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>What shape is this?</p>
                                        <div style={{ display: 'inline-block', background: '#DCFCE7', borderRadius: '12px', padding: '10px 24px' }}>
                                            <span style={{ fontSize: '16px', fontWeight: 700, color: '#14532D' }}>✅ Answer: <strong>Circle</strong></span>
                                        </div>
                                    </div>

                                    <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
                                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔺</div>
                                        <p style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>What shape is this?</p>
                                        <div style={{ display: 'inline-block', background: '#DCFCE7', borderRadius: '12px', padding: '10px 24px' }}>
                                            <span style={{ fontSize: '16px', fontWeight: 700, color: '#14532D' }}>✅ Answer: <strong>Triangle</strong></span>
                                        </div>
                                    </div>

                                    <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
                                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>▭</div>
                                        <p style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>What shape is this?</p>
                                        <div style={{ display: 'inline-block', background: '#DCFCE7', borderRadius: '12px', padding: '10px 24px' }}>
                                            <span style={{ fontSize: '16px', fontWeight: 700, color: '#14532D' }}>✅ Answer: <strong>Rectangle</strong></span>
                                        </div>
                                    </div>

                                </div>
                            </Section>
                        </>
                    )}

                    {/* ──────────── 6. VIDEO ──────────── */}
                    <Section id="videos">
                        <SectionTitle emoji="🎬">Watch the Lesson Videos</SectionTitle>
                        <p style={{ fontSize: '15px', color: '#64748B', marginBottom: '20px' }}>
                            {currentLesson.videoSubtitle || 'Watch these fun videos to learn more! Click a video to watch it in full screen.'}
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: currentLesson.videos.length === 1 ? '1fr' : 'repeat(3, 1fr)', gap: '16px' }}>
                            {currentLesson.videos.map((video, i) => (
                                <div
                                    key={i}
                                    onClick={() => setSelectedVideo(video)}
                                    style={{
                                        borderRadius: '16px', overflow: 'hidden',
                                        border: '1px solid #E2E8F0', aspectRatio: '16/9',
                                        cursor: 'pointer', position: 'relative',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'scale(1.03)';
                                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <img
                                        src={video.thumb}
                                        alt={video.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                    />
                                    {/* Play overlay */}
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        background: 'rgba(0,0,0,0.3)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'background 0.2s',
                                    }}>
                                        <div style={{
                                            width: '52px', height: '52px', borderRadius: '50%',
                                            background: 'rgba(255,255,255,0.95)', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center',
                                            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                                        }}>
                                            <Play size={22} style={{ color: '#EF4444', marginLeft: '3px' }} fill="#EF4444" />
                                        </div>
                                    </div>
                                    {/* Title bar */}
                                    <div style={{
                                        position: 'absolute', bottom: 0, left: 0, right: 0,
                                        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                                        padding: '16px 12px 10px', color: '#fff',
                                        fontSize: '12px', fontWeight: 600,
                                    }}>
                                        {video.title}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>

                    {/* Video Modal */}
                    {selectedVideo && (
                        <div
                            onClick={() => setSelectedVideo(null)}
                            style={{
                                position: 'fixed', inset: 0, zIndex: 9999,
                                background: 'rgba(0,0,0,0.85)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                padding: '40px',
                            }}
                        >
                            <button
                                onClick={() => setSelectedVideo(null)}
                                style={{
                                    position: 'absolute', top: '20px', right: '20px',
                                    background: 'rgba(255,255,255,0.15)', border: 'none',
                                    borderRadius: '50%', width: '48px', height: '48px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', color: '#fff',
                                    transition: 'background 0.2s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                            >
                                <X size={24} />
                            </button>
                            <div
                                onClick={e => e.stopPropagation()}
                                style={{
                                    width: '100%', maxWidth: '1100px',
                                    aspectRatio: '16/9', borderRadius: '16px',
                                    overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                                }}
                            >
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={selectedVideo.src + '&autoplay=1'}
                                    title={selectedVideo.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                                    style={{ display: 'block' }}
                                />
                            </div>
                        </div>
                    )}

                    {/* ──────────── 7. QUIZ ──────────── */}
                    <Section id="quiz" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                        <SectionTitle emoji="🧠">Quiz Time!</SectionTitle>
                        <p style={{ fontSize: '15px', color: '#1E40AF', marginBottom: '24px' }}>
                            Let's test what you learned! Choose the correct answer for each question.
                        </p>

                        {currentLesson.quiz.map((q, qIndex) => (
                            <div key={qIndex} style={{
                                background: '#FFFFFF', borderRadius: '16px', padding: '24px',
                                marginBottom: '20px', border: '1px solid #DBEAFE',
                            }}>
                                <p style={{ fontSize: '16px', fontWeight: 700, color: '#1E293B', marginBottom: '8px' }}>
                                    Question {qIndex + 1}
                                </p>
                                <p style={{ fontSize: '15px', color: '#475569', marginBottom: '12px' }}>
                                    {q.question}
                                </p>
                                <div style={{
                                    fontSize: '32px', letterSpacing: '6px', marginBottom: '18px',
                                    background: '#F8FAFC', borderRadius: '12px', padding: '16px',
                                    textAlign: 'center',
                                }}>
                                    {q.visual}
                                </div>
                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                    {q.options.map((opt, oIndex) => {
                                        const isSelected = answers[qIndex] === oIndex;
                                        const isCorrect = oIndex === q.correct;
                                        let bg = '#F1F5F9';
                                        let border = '2px solid #E2E8F0';
                                        let color = '#334155';

                                        if (showResults && isSelected && isCorrect) {
                                            bg = '#D1FAE5'; border = '2px solid #22C55E'; color = '#065F46';
                                        } else if (showResults && isSelected && !isCorrect) {
                                            bg = '#FEE2E2'; border = '2px solid #EF4444'; color = '#991B1B';
                                        } else if (showResults && isCorrect) {
                                            bg = '#D1FAE5'; border = '2px solid #22C55E'; color = '#065F46';
                                        } else if (isSelected) {
                                            bg = '#DBEAFE'; border = '2px solid #3B82F6'; color = '#1E40AF';
                                        }

                                        return (
                                            <button
                                                key={oIndex}
                                                onClick={() => handleAnswer(qIndex, oIndex)}
                                                style={{
                                                    flex: '1 1 auto', minWidth: '80px',
                                                    padding: '14px 20px', borderRadius: '12px',
                                                    background: bg, border, color,
                                                    fontSize: '16px', fontWeight: 700,
                                                    cursor: showResults ? 'default' : 'pointer',
                                                    display: 'flex', alignItems: 'center',
                                                    justifyContent: 'center', gap: '8px',
                                                    transition: 'all 0.2s ease',
                                                }}
                                            >
                                                {showResults && isSelected && isCorrect && <CheckCircle2 size={18} />}
                                                {showResults && isSelected && !isCorrect && <XCircle size={18} />}
                                                {showResults && !isSelected && isCorrect && <CheckCircle2 size={18} />}
                                                {opt}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        {!showResults ? (
                            <button
                                onClick={handleSubmitQuiz}
                                disabled={Object.keys(answers).length < currentLesson.quiz.length}
                                style={{
                                    width: '100%', padding: '16px',
                                    background: Object.keys(answers).length < currentLesson.quiz.length ? '#94A3B8' : '#3B82F6',
                                    color: '#FFFFFF', border: 'none', borderRadius: '14px',
                                    fontSize: '16px', fontWeight: 700, cursor: Object.keys(answers).length < currentLesson.quiz.length ? 'not-allowed' : 'pointer',
                                    transition: 'background 0.2s ease',
                                }}
                            >
                                Submit Answers
                            </button>
                        ) : (
                            <div style={{
                                background: score === currentLesson.quiz.length ? '#D1FAE5' : '#FEF3C7',
                                borderRadius: '14px', padding: '20px', textAlign: 'center',
                            }}>
                                <div style={{ fontSize: '28px', marginBottom: '8px' }}>
                                    {score === currentLesson.quiz.length ? '🎉' : '💪'}
                                </div>
                                <p style={{
                                    fontSize: '18px', fontWeight: 700,
                                    color: score === currentLesson.quiz.length ? '#065F46' : '#92400E',
                                }}>
                                    You got {score} out of {currentLesson.quiz.length} correct!
                                </p>
                                <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>
                                    {score === currentLesson.quiz.length ? 'Perfect score! Amazing! 🌟' : 'Keep practicing, you\'re doing great!'}
                                </p>
                            </div>
                        )}
                    </Section>

                    {/* ──────────── 8. SUMMARY ──────────── */}
                    <Section style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                        <SectionTitle emoji="📋">Lesson Summary</SectionTitle>
                        <p style={{ fontSize: '15px', color: '#166534', marginBottom: '14px', fontWeight: 500 }}>
                            Today we learned:
                        </p>
                        <ul style={{
                            listStyle: 'none', padding: 0, margin: '0 0 20px',
                            display: 'flex', flexDirection: 'column', gap: '10px',
                        }}>
                            {currentLesson.summary.map((item, i) => (
                                <li key={i} style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    fontSize: '15px', color: '#166534',
                                }}>
                                    <CheckCircle2 size={18} style={{ color: '#22C55E', flexShrink: 0 }} />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <div style={{
                            background: '#DCFCE7', borderRadius: '12px', padding: '16px 20px',
                            display: 'flex', alignItems: 'center', gap: '12px',
                        }}>
                            <Sparkles size={22} style={{ color: '#16A34A' }} />
                            <span style={{ fontSize: '16px', fontWeight: 700, color: '#14532D' }}>
                                {currentLesson.summaryEnd}
                            </span>
                        </div>
                    </Section>

                    {/* ──────────── 9. NEXT LESSON ──────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                        style={{ marginBottom: '64px' }}
                    >
                        <button
                            onClick={() => navigate(`/learning/class/${classId}/subject/${subjectId}/chapter/${currentLesson.nextLesson.id}`)}
                            style={{
                                width: '100%',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                                color: '#FFFFFF', border: 'none', borderRadius: '18px',
                                padding: '22px 28px', cursor: 'pointer',
                                boxShadow: '0 8px 24px rgba(37,99,235,0.25)',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 12px 32px rgba(37,99,235,0.35)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(37,99,235,0.25)';
                            }}
                        >
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: '13px', fontWeight: 600, opacity: 0.8, marginBottom: '4px' }}>
                                    Next Lesson
                                </div>
                                <div style={{ fontSize: '18px', fontWeight: 700 }}>
                                    {currentLesson.nextLesson.title} →
                                </div>
                            </div>
                            <ArrowRight size={24} />
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Footer */}
            <div style={{
                textAlign: 'center', padding: '24px',
                borderTop: '1px solid #E2E8F0', color: '#94A3B8', fontSize: '13px',
            }}>
                © 2024 EduReach Education. All rights reserved.
            </div>
        </div>
    );
};

export default LessonPage;
