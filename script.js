// Auth Guard - Redirect to login if not authenticated
(function() {
    const protectedPages = ['dashboard.html', 'applications.html', 'interviews.html', 'profile.html', 'view-profile.html', 'recruiter-dashboard.html', 'candidates.html', 'analysis.html', 'index.html', 'ai-assistant.html', ''];
    const currentPage = window.location.pathname.split('/').pop();
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

    // Allow access only to login and signup pages if not logged in
    if (!isLoggedIn && protectedPages.includes(currentPage)) {
        window.location.href = 'login.html';
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    // Database Cleanup: Remove duplicate 'Project Manager' entries from 'AdronTech' if they exist
    const currentJobs = JSON.parse(localStorage.getItem('portalJobs') || '[]');
    let targetJobCount = 0;
    const deduplicatedJobs = currentJobs.filter(job => {
        const isMatch = job.title && job.title.toLowerCase() === 'project manager' && 
                        job.company && job.company.toLowerCase() === 'adrontech';
        if (isMatch) {
            targetJobCount++;
            return targetJobCount <= 1;
        }
        return true;
    });
    if (targetJobCount > 1) {
        localStorage.setItem('portalJobs', JSON.stringify(deduplicatedJobs));
    }

    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const progressFill = document.getElementById('progressFill');

    if (dropZone) {
        // Handle click to upload
        dropZone.addEventListener('click', () => {
            fileInput.click();
        });

        // Handle file selection
        fileInput.addEventListener('change', (e) => {
            handleFiles(e.target.files);
        });

        // Drag and drop events
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => {
                dropZone.classList.add('drag-over');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => {
                dropZone.classList.remove('drag-over');
            });
        });

        dropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles(files);
        });
    }

    function handleFiles(files) {
        if (sessionStorage.getItem('isLoggedIn') !== 'true') {
            window.location.href = 'login.html';
            return;
        }
        if (files.length > 0) {
            const file = files[0];
            
            // Show file info
            fileInfo.style.display = 'block';
            fileName.textContent = `Analyzing: ${file.name}`;
            
            // Save actual file to localStorage as Base64
            const currentUser = sessionStorage.getItem('currentUser') || 'Anonymous Candidate';
            const reader = new FileReader();
            reader.onload = function(e) {
                const resumes = JSON.parse(localStorage.getItem('portalResumes') || '{}');
                resumes[currentUser] = {
                    name: file.name,
                    data: e.target.result
                };
                localStorage.setItem('portalResumes', JSON.stringify(resumes));
            };
            reader.readAsDataURL(file);
            
            // Simulate upload/analysis progress
            simulateAnalysis();
        }
    }

    function simulateAnalysis() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    window.location.href = 'analysis.html';
                }, 800);
            }
            progressFill.style.width = `${progress}%`;
        }, 300);
    }

    // Scroll header effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '1rem 10%';
            header.style.boxShadow = '0 10px 30px -10px rgba(0,0,0,0.5)';
        } else {
            header.style.padding = '1.5rem 10%';
            header.style.boxShadow = 'none';
        }
    });

    // Add staggered animation delay to job cards
    const jobCards = document.querySelectorAll('.job-card');
    jobCards.forEach((card, index) => {
        card.style.animationDelay = `${(index + 1) * 0.1}s`;
        card.classList.add('animate-up');
    });

    // Real-time Dashboard Simulation
    const statsValues = document.querySelectorAll('.stat-card .value');
    if (statsValues.length > 0 && window.location.pathname.includes('dashboard.html')) {
        setInterval(() => {
            // Randomly update stats to feel 'live'
            const targetStat = statsValues[Math.floor(Math.random() * statsValues.length)];
            const currentValue = parseInt(targetStat.textContent);
            if (Math.random() > 0.8) {
                targetStat.textContent = currentValue + 1;
                targetStat.style.color = 'var(--accent)';
                setTimeout(() => targetStat.style.color = '', 1000);
            }
        }, 5000);
    }

    // Real-time Application History Update
    const statusBadges = document.querySelectorAll('.status-badge.status-pending');
    if (statusBadges.length > 0 && window.location.pathname.includes('applications.html')) {
        setTimeout(() => {
            const firstPending = statusBadges[0];
            firstPending.textContent = 'Reviewing...';
            firstPending.classList.add('pulse');
        }, 3000);

        setTimeout(() => {
            const firstPending = statusBadges[0];
            firstPending.textContent = 'Shortlisted';
            firstPending.className = 'status-badge status-accepted';
            showToast('Application Status Updated: Shortlisted!');
        }, 10000);
    }

    // Real-time Interview Countdown
    const interviewTimer = document.querySelector('.timeline-item.active p');
    if (interviewTimer && window.location.pathname.includes('interviews.html')) {
        let seconds = 3600; // 1 hour
        setInterval(() => {
            seconds--;
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            if (interviewTimer.textContent.includes('Scheduled')) {
                interviewTimer.innerHTML = `Scheduled for May 5, 2026. <span style="color: var(--accent);">Starts in: ${mins}m ${secs}s</span>`;
            }
        }, 1000);
    }

    // Apply Button Logic
    const applyButtons = document.querySelectorAll('.apply-btn');
    const toast = document.getElementById('toast');

    applyButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.classList.contains('btn-applied')) return;

            // Change button state
            this.textContent = 'Applied';
            this.classList.remove('btn-primary');
            this.classList.add('btn-applied');

            // Show toast();
            showToast('Application Submitted Successfully!');
        });
    });

    // Job Search Functionality
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.job-card');
            
            cards.forEach(card => {
                const title = card.querySelector('h2').textContent.toLowerCase();
                const company = card.querySelector('p').textContent.toLowerCase();
                if (title.includes(term) || company.includes(term)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Animate Skill Gap Bars on Scroll
    const skillBars = document.querySelectorAll('.progress-bar-small div');
    if (skillBars.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetWidth = entry.target.style.width;
                    entry.target.style.width = '0%';
                    setTimeout(() => {
                        entry.target.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                        entry.target.style.width = targetWidth;
                    }, 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        skillBars.forEach(bar => observer.observe(bar));
    }

    // Dynamic Header Logic
    function updateHeader() {
        const authContainer = document.querySelector('.auth');
        if (!authContainer) return;

        const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
        const profileCreated = sessionStorage.getItem('profileCreated') === 'true';
        const userName = sessionStorage.getItem('currentUser') || 'User';

        if (isLoggedIn || profileCreated) {
            // User is logged in or profile exists - replace Login button with User Profile Info
            authContainer.innerHTML = `
                <div style="display: flex; align-items: center; gap: 1.5rem;">
                    <div class="profile-completion" style="display: flex; align-items: center; gap: 1rem;">
                        <div style="text-align: right;">
                            <p style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; margin: 0;">Profile Strength</p>
                            <p style="font-size: 0.8rem; font-weight: 600; color: var(--accent); margin: 0;">85%</p>
                        </div>
                        <div style="width: 60px; height: 5px; background: var(--glass-border); border-radius: 3px; overflow: hidden;">
                            <div style="width: 85%; height: 100%; background: var(--accent);"></div>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.8rem;">
                        <div style="text-align: right; line-height: 1.2;">
                            <span style="display: block; font-size: 0.75rem; color: var(--text-muted);">Welcome,</span>
                            <a href="view-profile.html" style="display: block; font-size: 0.9rem; font-weight: 600; color: white; text-decoration: none; border-bottom: 1px dashed var(--primary);">${userName}</a>
                        </div>
                        <div style="width: 38px; height: 38px; border-radius: 50%; background: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: 700; border: 2px solid var(--glass-border);">
                            ${userName.charAt(0).toUpperCase()}
                        </div>
                        <a href="javascript:void(0)" onclick="logout()" style="color: #ef4444; font-size: 0.9rem; margin-left: 0.5rem;" title="Logout">
                            <i class="fas fa-sign-out-alt"></i>
                        </a>
                    </div>
                </div>
            `;
        }
    }

    window.logout = function() {
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('profileCreated');
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    };

    updateHeader();

    window.showToast = function(message = 'Action Successful!') {
        if (!toast) return;
        toast.textContent = message;
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    };

    // --- Job Posting Logic ---
    const postJobForm = document.getElementById('postJobForm');
    if (postJobForm) {
        postJobForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('jobTitle').value;
            const company = document.getElementById('jobCompany').value;
            const location = document.getElementById('jobLocation').value;
            const salary = document.getElementById('jobSalary').value;
            const type = document.getElementById('jobType').value;

            const newJob = { 
                id: Date.now().toString(),
                title, 
                company, 
                location, 
                salary, 
                type, 
                matchScore: Math.floor(Math.random() * 20 + 80),
                recruiter: sessionStorage.getItem('currentUser')
            };
            
            const jobs = JSON.parse(localStorage.getItem('portalJobs') || '[]');
            jobs.push(newJob);
            localStorage.setItem('portalJobs', JSON.stringify(jobs));

            showToast('Job Posted Successfully!');
            setTimeout(() => {
                window.location.href = 'recruiter-dashboard.html';
            }, 1000);
        });
    }

    // Move getApplicantCount here so it's defined before renderDynamicJobs is called
    window.getApplicantCount = function(jobId) {
        const apps = JSON.parse(localStorage.getItem('portalApplications') || '[]');
        return apps.filter(a => a.jobId === jobId).length;
    };

    // --- Dynamic Job Rendering ---
    function renderDynamicJobs() {
        const jobsListContainer = document.querySelector('.jobs-list');
        if (!jobsListContainer || window.location.pathname.includes('candidates.html') || window.location.pathname.includes('applications.html')) return;

        const jobs = JSON.parse(localStorage.getItem('portalJobs') || '[]');
        const isRecruiter = sessionStorage.getItem('currentUserRole') === 'recruiter';
        const currentUser = sessionStorage.getItem('currentUser');

        let displayJobs = jobs;
        if (isRecruiter) {
            displayJobs = jobs.filter(job => job.recruiter === currentUser);
        }

        displayJobs.reverse().forEach(job => {
            const jobElement = document.createElement('div');
            jobElement.className = 'glass job-card';
            jobElement.style.animationDelay = '0.1s';
            jobElement.classList.add('animate-up');

            // Check if already applied
            const applications = JSON.parse(localStorage.getItem('portalApplications') || '[]');
            const hasApplied = applications.some(app => app.jobId === job.id && app.candidateName === currentUser);

            let actionButton = '';
            if (isRecruiter) {
                actionButton = `
                    <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                        <a href="candidates.html?jobId=${job.id}" class="btn btn-outline" style="flex: 1; text-align: center;">View Candidates</a>
                        <button class="btn btn-outline" style="border-color: #ef4444; color: #ef4444; padding: 0.5rem 1rem;" onclick="deleteJob('${job.id}')"><i class="fas fa-trash-alt"></i></button>
                    </div>
                `;
            } else if (hasApplied) {
                actionButton = `<div class="score-badge">${job.matchScore}% Match</div>
                   <a href="javascript:void(0)" class="btn btn-applied" style="margin-top: 1rem;">Applied</a>`;
            } else {
                actionButton = `<div class="score-badge">${job.matchScore}% Match</div>
                   <a href="javascript:void(0)" class="btn btn-primary apply-btn" style="margin-top: 1rem;" onclick="applyForJob('${job.id}', '${job.title}', '${job.recruiter}', this)">Apply Now</a>`;
            }

            let applicantCount = isRecruiter ? ` • <i class="fas fa-users"></i> ${getApplicantCount(job.id)} Applicants` : ``;

            jobElement.innerHTML = `
                <div class="job-info">
                    <h2>${job.title}</h2>
                    <p><i class="fas fa-building"></i> ${job.company} • <i class="fas fa-map-marker-alt"></i> ${job.location}</p>
                    <p style="margin-top: 0.5rem;"><i class="fas fa-wallet"></i> <span style="color: var(--accent);">${job.salary}</span> • <i class="fas fa-briefcase"></i> ${job.type}${applicantCount}</p>
                </div>
                <div class="match-score">
                    ${actionButton}
                </div>
            `;
            
            // Insert right after the header section in the jobs list
            const headerElement = jobsListContainer.firstElementChild;
            if (headerElement) {
                headerElement.insertAdjacentElement('afterend', jobElement);
            }
        });
    }

    renderDynamicJobs();

    // Application helper function
    window.applyForJob = function(jobId, jobTitle, recruiter, btnElement) {
        if (btnElement.classList.contains('btn-applied')) return;

        const applications = JSON.parse(localStorage.getItem('portalApplications') || '[]');
        const currentUser = sessionStorage.getItem('currentUser') || 'Anonymous Candidate';

        // Prevent duplicate: check if user already applied to this job
        const alreadyApplied = applications.some(app => app.jobId === jobId && app.candidateName === currentUser);
        if (alreadyApplied) {
            btnElement.textContent = 'Applied';
            btnElement.classList.remove('btn-primary');
            btnElement.classList.add('btn-applied');
            return;
        }

        // Save the application
        applications.push({
            jobId,
            jobTitle,
            recruiter,
            candidateName: currentUser,
            date: new Date().toLocaleDateString(),
            matchScore: Math.floor(Math.random() * 20 + 80)
        });
        localStorage.setItem('portalApplications', JSON.stringify(applications));

        // Update button UI
        btnElement.textContent = 'Applied';
        btnElement.classList.remove('btn-primary');
        btnElement.classList.add('btn-applied');
        showToast('Application Submitted Successfully!');
    };

    // Custom Confirmation Modal Helper
    window.showConfirmModal = function({ title, text, icon, confirmText, onConfirm }) {
        let modal = document.getElementById('customModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'customModal';
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="glass modal-content">
                    <div class="modal-icon" id="modalIcon"></div>
                    <h3 class="modal-title" id="modalTitle"></h3>
                    <p class="modal-text" id="modalText"></p>
                    <div class="modal-actions">
                        <button class="btn btn-outline" id="modalCancel">Cancel</button>
                        <button class="btn btn-primary" id="modalConfirm" style="background: #ef4444;"></button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        const iconEl = modal.querySelector('#modalIcon');
        const titleEl = modal.querySelector('#modalTitle');
        const textEl = modal.querySelector('#modalText');
        const confirmBtn = modal.querySelector('#modalConfirm');
        const cancelBtn = modal.querySelector('#modalCancel');

        iconEl.innerHTML = `<i class="fas ${icon || 'fa-exclamation-triangle'}"></i>`;
        titleEl.textContent = title || 'Are you sure?';
        textEl.textContent = text || 'This action cannot be undone.';
        confirmBtn.textContent = confirmText || 'Confirm';

        modal.classList.add('active');

        const closeModal = () => modal.classList.remove('active');

        confirmBtn.onclick = () => {
            onConfirm();
            closeModal();
        };

        cancelBtn.onclick = closeModal;
        modal.onclick = (e) => { if (e.target === modal) closeModal(); };
    };

    // Recruiter Job Deletion
    window.deleteJob = function(jobId) {
        showConfirmModal({
            title: 'End Job Posting?',
            text: 'Are you sure you want to remove this job? Candidates will no longer be able to see or apply for it.',
            icon: 'fa-trash-alt',
            confirmText: 'End Posting',
            onConfirm: () => {
                let jobs = JSON.parse(localStorage.getItem('portalJobs') || '[]');
                jobs = jobs.filter(job => job.id !== jobId);
                localStorage.setItem('portalJobs', JSON.stringify(jobs));
                
                showToast('Job posting ended successfully.');
                setTimeout(() => location.reload(), 1000);
            }
        });
    };

    function renderDynamicCandidates() {
        const candidatesContainer = document.getElementById('dynamic-candidates-list');
        if (!candidatesContainer || !window.location.pathname.includes('candidates.html')) return;

        const applications = JSON.parse(localStorage.getItem('portalApplications') || '[]');
        const currentUser = sessionStorage.getItem('currentUser');
        
        // Check if there's a specific jobId filter in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const filterJobId = urlParams.get('jobId');

        // Filter applications for jobs posted by this specific recruiter
        let myCandidates = applications.filter(app => app.recruiter === currentUser);
        
        if (filterJobId) {
            myCandidates = myCandidates.filter(app => app.jobId === filterJobId);
        }

        if (myCandidates.length === 0) {
            candidatesContainer.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                    <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>No candidates have applied to your jobs yet.</p>
                </div>
            `;
            return;
        }

        candidatesContainer.innerHTML = ''; // Clear container

        myCandidates.forEach((app, index) => {
            const initials = app.candidateName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            const colors = ['var(--primary)', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];
            const bgColor = colors[index % colors.length];

            // Look up the candidate's email
            const users = JSON.parse(localStorage.getItem('portalUsers') || '[]');
            const candidateUser = users.find(u => u.name === app.candidateName);
            const candidateEmail = candidateUser ? candidateUser.email : 'candidate@example.edu';

            const candidateEl = document.createElement('div');
            candidateEl.className = 'glass job-card animate-up';
            candidateEl.style.alignItems = 'flex-start';
            candidateEl.style.animationDelay = `${index * 0.1}s`;

            candidateEl.innerHTML = `
                <div style="display: flex; gap: 1.5rem; align-items: center; flex: 1;">
                    <div style="width: 60px; height: 60px; border-radius: 50%; background: ${bgColor}; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: bold; border: 2px solid var(--glass-border);">
                        ${initials}
                    </div>
                    <div class="job-info">
                        <h2 style="margin-bottom: 0.3rem;">${app.candidateName}</h2>
                        <p style="color: var(--text-muted);"><i class="fas fa-envelope"></i> ${candidateEmail}</p>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem;">
                            <span class="tech-tag">Verified Applicant</span>
                        </div>
                    </div>
                </div>
                <div class="match-score" style="text-align: right; min-width: 200px;">
                    <div class="score-badge" style="display: inline-block; margin-bottom: 0.5rem;">${app.matchScore}% Match</div>
                    <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1rem;">Applied: ${app.jobTitle}</p>
                    <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                        <a href="view-profile.html?candidateName=${encodeURIComponent(app.candidateName)}" class="btn btn-outline" style="padding: 0.5rem 1rem; font-size: 0.85rem; text-decoration: none;"><i class="fas fa-file-alt"></i> Resume</a>
                        <button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.85rem;" onclick="simulateEmailSend('${candidateEmail}', '${app.candidateName}', this)"><i class="fas fa-paper-plane"></i> Invite</button>
                    </div>
                </div>
            `;
            candidatesContainer.appendChild(candidateEl);
        });
    }

    // Email Simulator function
    window.simulateEmailSend = function(email, name, btnElement) {
        if (btnElement.classList.contains('btn-applied')) return;

        // Visual loading state
        btnElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btnElement.style.opacity = '0.8';
        btnElement.style.pointerEvents = 'none';

        // Simulate network delay for sending email
        setTimeout(() => {
            btnElement.innerHTML = '<i class="fas fa-check-circle"></i> Invited';
            btnElement.classList.remove('btn-primary');
            btnElement.classList.add('btn-applied');
            btnElement.style.opacity = '1';
            
            showToast(`Automatic Interview Invitation sent to ${email}`);
        }, 1200);
    };

    renderDynamicCandidates();
});
