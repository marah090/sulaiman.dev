const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 1. Typing effect for the role line
const typed = document.getElementById('typed');
const roles = ['Software Engineer', 'Web Developer', 'Python Developer','Hardware Engineer','Clouding Engineer'];

if (typed && !reduceMotion) {
    let r = 0, c = 0, deleting = false;
    (function tick() {
        const word = roles[r];
        c += deleting ? -1 : 1;
        typed.textContent = word.slice(0, c);
        let delay = deleting ? 40 : 80;
        if (!deleting && c === word.length) { deleting = true; delay = 1400; }
        else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; delay = 300; }
        setTimeout(tick, delay);
    })();
}

// 2. Fill skill bars when they scroll into view
const skills = document.querySelector('.skills');
if (skills && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
        });
    }, { threshold: 0.3 });
    io.observe(skills);
} else if (skills) {
    skills.classList.add('in-view');
}

// 3. Light / dark theme
const root = document.documentElement;
document.getElementById('theme').addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
});

// 4. Copy email
const copyBtn = document.getElementById('copy');
copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(copyBtn.dataset.copy);
        copyBtn.textContent = 'Copied';
    } catch (e) {
        copyBtn.textContent = 'Press Ctrl+C to copy';
    }
    setTimeout(() => { copyBtn.textContent = 'Copy email'; }, 2000);
});

// 5. Scroll progress bar, back-to-top button, active nav link
const bar = document.getElementById('progressTop');
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    toTop.classList.toggle('show', window.scrollY > 600);
}, { passive: true });

const links = document.querySelectorAll('.topbar nav a');
if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) {
                links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section').forEach((s) => spy.observe(s));
}

// 6. Mobile menu
const menu = document.getElementById('menu');
const nav = document.getElementById('nav');
menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
});
nav.addEventListener('click', (e) => {
    if (e.target.tagNnn  === 'A') {
         nav.classList.remove('open');
          menu.setAttribute('aria-expanded', 'false'); }
});

// 7. Interactive terminal (buttons or typing)
const out = document.getElementById('termOut');
const form = document.getElementById('termForm');
const input = document.getElementById('termIn');

const commands = {
    help: () => 'Commands: whoami, skills, projects, contact, clear',
    whoami: () => 'Sulaiman\nSoftware Engineer, Web Developer and Python Developer based in Freetown.\nI build websites, applications and business systems.',
    skills: () => 'Web Development     100%\nNetworking           90%\nData Analysis        85%\nCritical Thinking    90%',
    projects: () => '1. Supermarket Website\n2. Market Management System\n3. TCP/IP Learning App\n(see the Projects section for details)',
    contact: () => 'Email: marahsulaiman090@gmail.com\nPhone: +232 75595520',
};

function print(text, cls) {
    const line = document.createElement('div');
    if (cls) line.className = cls;
    line.textContent = text;
    out.appendChild(line);
    out.scrollTop = out.scrollHeight;
}

function run(raw) {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    if (cmd === 'clear') { out.textContent = ''; return; }
    print('$ ' + cmd, 'cmd');
    if (commands[cmd]) print(commands[cmd]());
    else print('command not found: ' + cmd + '. Type help to see what you can run.', 'err');
}

print('Welcome. Click a command below or type help.', 'muted');
run('whoami');

document.querySelectorAll('.term-buttons button').forEach((b) => {
    b.addEventListener('click', () => run(b.dataset.cmd));
});
form.addEventListener('submit', (e) => {
    e.preventDefault();
    run(input.value);
    input.value = '';
});
