document.addEventListener('DOMContentLoaded', () => {
  const copyButton = document.querySelector('[data-copy-target="citation-bibtex"]');
  const citationBlock = document.getElementById('citation-bibtex');
  const copyStatus = document.querySelector('.copy-status');

  if (copyButton && citationBlock && copyStatus) {
    const originalLabel = copyButton.textContent;
    let resetTimer;

    const legacyCopy = (text) => {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.setAttribute('readonly', '');
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        if (!document.execCommand('copy')) throw new Error('Clipboard copy was rejected.');
      } finally {
        textArea.remove();
        copyButton.focus({ preventScroll: true });
      }
    };

    copyButton.addEventListener('click', async () => {
      const text = citationBlock.textContent.trim();
      try {
        if (navigator.clipboard && window.isSecureContext) {
          try {
            await navigator.clipboard.writeText(text);
          } catch {
            legacyCopy(text);
          }
        } else {
          legacyCopy(text);
        }
        copyButton.textContent = 'Copied!';
        copyButton.classList.add('is-copied');
        copyStatus.textContent = 'BibTeX citation copied to clipboard.';
      } catch {
        copyButton.textContent = originalLabel;
        copyButton.classList.remove('is-copied');
        copyStatus.textContent = 'Copy could not complete. Select and copy the citation below.';
      }
      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => {
        copyButton.textContent = originalLabel;
        copyButton.classList.remove('is-copied');
        copyStatus.textContent = '';
      }, 2500);
    });
  }

  const canAutoplayVideo = (video) => {
    const slide = video.closest('.carousel-slide');
    return video.muted && video.dataset.inViewport === 'true' && slide?.classList.contains('is-active');
  };

  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const viewport = carousel.querySelector('.carousel-viewport');
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
    const dots = Array.from(carousel.querySelectorAll('.carousel-dot'));
    const previous = carousel.querySelector('[data-carousel-prev]');
    const next = carousel.querySelector('[data-carousel-next]');
    let currentIndex = 0;
    let pointerStart = null;

    if (!viewport || !track || !slides.length) {
      return;
    }

    const setSlide = (index) => {
      currentIndex = Math.max(0, Math.min(index, slides.length - 1));
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === currentIndex;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
        slide.inert = !active;
        slide.querySelectorAll('video').forEach((video) => {
          if (!active) {
            video.pause();
          } else if (canAutoplayVideo(video)) {
            video.play().catch(() => {});
          }
        });
      });
      dots.forEach((dot) => {
        const active = Number(dot.dataset.slide) === currentIndex;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-pressed', String(active));
      });
      if (previous) previous.disabled = currentIndex === 0;
      if (next) next.disabled = currentIndex === slides.length - 1;
    };

    previous?.addEventListener('click', () => setSlide(currentIndex - 1));
    next?.addEventListener('click', () => setSlide(currentIndex + 1));
    dots.forEach((dot) => dot.addEventListener('click', () => setSlide(Number(dot.dataset.slide))));

    carousel.addEventListener('keydown', (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey ||
          event.target.closest('video, input, textarea, select, .table-scroll, [contenteditable="true"]')) {
        return;
      }
      const destinations = { ArrowLeft: currentIndex - 1, ArrowRight: currentIndex + 1, Home: 0, End: slides.length - 1 };
      if (Object.hasOwn(destinations, event.key)) {
        event.preventDefault();
        setSlide(destinations[event.key]);
      }
    });

    // Keep native video controls and vertical page scrolling available.
    viewport.addEventListener('pointerdown', (event) => {
      if (!event.isPrimary || event.button !== 0 || event.target.closest('video[controls], button, a, input, textarea, select, .table-scroll')) {
        return;
      }
      pointerStart = { id: event.pointerId, x: event.clientX, y: event.clientY };
      viewport.setPointerCapture(event.pointerId);
    });

    viewport.addEventListener('pointermove', (event) => {
      if (!pointerStart || event.pointerId !== pointerStart.id) return;
      let offset = event.clientX - pointerStart.x;
      if (Math.abs(offset) < 8 || Math.abs(offset) < Math.abs(event.clientY - pointerStart.y)) return;
      if ((currentIndex === 0 && offset > 0) || (currentIndex === slides.length - 1 && offset < 0)) {
        offset *= 0.2;
      }
      track.classList.add('is-dragging');
      track.style.transform = `translateX(calc(-${currentIndex * 100}% + ${offset}px))`;
    });

    const finishPointer = (event, cancelled = false) => {
      if (!pointerStart || event.pointerId !== pointerStart.id) return;
      const deltaX = event.clientX - pointerStart.x;
      const deltaY = event.clientY - pointerStart.y;
      pointerStart = null;
      track.classList.remove('is-dragging');
      if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
      const swipe = !cancelled && Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2;
      setSlide(currentIndex + (swipe ? (deltaX < 0 ? 1 : -1) : 0));
    };
    viewport.addEventListener('pointerup', (event) => finishPointer(event));
    viewport.addEventListener('pointercancel', (event) => finishPointer(event, true));
    viewport.addEventListener('lostpointercapture', (event) => finishPointer(event, true));

    carousel.classList.add('is-initialized');
    setSlide(0);
  });

  document.querySelectorAll('[data-autodagger-demo]').forEach((demo) => {
    const buttons = Array.from(demo.querySelectorAll('[data-autodagger-scenario]'));
    const nodes = Object.fromEntries(Array.from(demo.querySelectorAll('[data-ad-node]')).map((node) => [node.dataset.adNode, node]));
    const links = Object.fromEntries(Array.from(demo.querySelectorAll('[data-ad-link]')).map((link) => [link.dataset.adLink, link]));
    const event = demo.querySelector('[data-ad-event]');
    const eventText = demo.querySelector('[data-ad-event-text]');
    const studentLabel = demo.querySelector('[data-ad-student-label]');
    const monitorLabel = demo.querySelector('[data-ad-monitor-label]');
    const teacherLabel = demo.querySelector('[data-ad-teacher-label]');
    const teacherMonitorLabel = demo.querySelector('[data-ad-teacher-monitor-label]');
    const studentManagerLabel = demo.querySelector('[data-ad-student-manager-label]');
    const teacherManagerLabel = demo.querySelector('[data-ad-teacher-manager-label]');
    const outcomeTitle = demo.querySelector('[data-ad-outcome-title]');
    const outcomeLabel = demo.querySelector('[data-ad-outcome-label]');
    const trajectoryResult = demo.querySelector('[data-ad-trajectory-result]');
    const frameStrip = demo.querySelector('[data-ad-frame-strip]');
    const stage = demo.querySelector('.autodagger-stage');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scenarioOrder = ['student-success', 'teacher-success', 'teacher-failure'];
    let timers = [];
    let currentScenario = 'teacher-success';
    let inViewport = false;

    const scenarios = {
      'student-success': {
        frames: ['student', 'student', 'student', 'student', 'student', 'student', 'student', 'student', 'student'],
        result: 'Discarded',
        discarded: true,
        finalPhase: { event: 'Student success · trajectory discarded', successEvent: true, active: ['studentManager'], complete: ['student', 'monitor'], links: ['student-monitor', 'monitor-student-manager', 'student-manager-outcome'], studentManagerLabel: 'Student success', outcome: 'failure' },
        outcomeTitle: 'Discard Trajectory', outcomeLabel: 'No teacher recovery', teacherLabel: 'Waiting'
      },
      'teacher-success': {
        frames: ['student', 'student', 'student', 'intervention', 'teacher', 'teacher', 'teacher', 'teacher', 'teacher'],
        result: 'Saved for training',
        finalPhase: { event: 'Teacher success · combined trajectory retained', successEvent: true, active: ['teacherManager'], complete: ['student', 'monitor', 'studentManager', 'teacher', 'teacherMonitor'], links: ['student-monitor', 'monitor-student-manager', 'student-manager-teacher', 'teacher-teacher-monitor', 'teacher-monitor-teacher-manager', 'teacher-manager-outcome'], studentManagerLabel: 'Teacher takeover', teacherLabel: 'Attempting recovery', teacherMonitorLabel: 'Tracking execution', teacherManagerLabel: 'Teacher success', outcome: 'success' },
        outcomeTitle: 'Retain Trajectory', outcomeLabel: 'Student rollout + teacher recovery', teacherLabel: 'Attempting recovery'
      },
      'teacher-failure': {
        frames: ['student', 'student', 'student', 'intervention', 'teacher', 'teacher', 'teacher', 'teacher', 'failure'],
        result: 'Discarded',
        discarded: true,
        finalPhase: { event: 'Teacher failure · trajectory discarded', alert: true, failureDecision: true, active: ['teacherManager'], complete: ['student', 'monitor', 'studentManager', 'teacher', 'teacherMonitor'], links: ['student-monitor', 'monitor-student-manager', 'student-manager-teacher', 'teacher-teacher-monitor', 'teacher-monitor-teacher-manager', 'teacher-manager-outcome'], studentManagerLabel: 'Teacher takeover', teacherLabel: 'Attempting recovery', teacherMonitorLabel: 'Tracking execution', teacherManagerLabel: 'Teacher failure', outcome: 'failure' },
        outcomeTitle: 'Discard Trajectory', outcomeLabel: 'Teacher recovery unsuccessful', teacherLabel: 'Attempting recovery'
      }
    };

    const updateConnectorGeometry = () => {
      if (!stage) return;
      const straightLinkKeys = [
        'student-monitor',
        'monitor-student-manager',
        'student-manager-outcome',
        'teacher-teacher-monitor',
        'teacher-monitor-teacher-manager',
        'teacher-manager-outcome'
      ];
      const specialLinks = [
        links['student-manager-student'],
        links['teacher-manager-teacher'],
        links['student-manager-teacher']
      ].filter(Boolean);
      if (window.matchMedia('(max-width: 768px)').matches) {
        straightLinkKeys.forEach((key) => {
          links[key]?.querySelector('svg')?.setAttribute('viewBox', '0 0 10 100');
          links[key]?.querySelector('path')?.setAttribute('d', 'M 5 0 V 100');
        });
        specialLinks.forEach((element) => {
          ['left', 'right', 'top', 'bottom', 'width', 'height'].forEach((property) => element.style.removeProperty(property));
        });
        const takeoverLink = links['student-manager-teacher'];
        takeoverLink?.querySelector('svg')?.setAttribute('viewBox', '0 0 10 100');
        takeoverLink?.querySelector('path')?.setAttribute('d', 'M 5 0 V 100');
        return;
      }
      straightLinkKeys.forEach((key) => {
        links[key]?.querySelector('svg')?.setAttribute('viewBox', '0 0 100 10');
        links[key]?.querySelector('path')?.setAttribute('d', 'M 0 5 H 100');
      });
      const stageRect = stage.getBoundingClientRect();
      const setBox = (element, left, top, width, height) => {
        if (!element) return;
        element.style.left = `${left}px`;
        element.style.right = 'auto';
        element.style.top = `${top}px`;
        element.style.bottom = 'auto';
        element.style.width = `${Math.max(0, width)}px`;
        element.style.height = `${Math.max(0, height)}px`;
      };
      const centerX = (element) => {
        const rect = element.getBoundingClientRect();
        return rect.left + rect.width / 2 - stageRect.left;
      };

      const studentRect = nodes.student.getBoundingClientRect();
      const studentManagerRect = nodes.studentManager.getBoundingClientRect();
      const studentX = centerX(nodes.student);
      const studentManagerX = centerX(nodes.studentManager);
      const shortLoopHeight = 26;
      setBox(
        links['student-manager-student'],
        studentX,
        demo.dataset.scenario === 'student-success'
          ? studentRect.bottom - stageRect.top
          : studentRect.top - stageRect.top - shortLoopHeight,
        studentManagerX - studentX,
        shortLoopHeight
      );
      const studentLoop = links['student-manager-student'];
      const studentLoopWidth = studentManagerX - studentX;
      studentLoop?.querySelector('svg')?.setAttribute('viewBox', `0 0 ${studentLoopWidth} ${shortLoopHeight}`);
      studentLoop?.querySelector('path')?.setAttribute(
        'd',
        demo.dataset.scenario === 'student-success'
          ? `M ${studentLoopWidth} 0 V 18 Q ${studentLoopWidth} ${shortLoopHeight} ${studentLoopWidth - 8} ${shortLoopHeight} H 8 Q 0 ${shortLoopHeight} 0 18 V 0`
          : `M ${studentLoopWidth} ${shortLoopHeight} V 8 Q ${studentLoopWidth} 0 ${studentLoopWidth - 8} 0 H 8 Q 0 0 0 8 V ${shortLoopHeight}`
      );

      if (nodes.teacher.offsetParent !== null) {
        const teacherRect = nodes.teacher.getBoundingClientRect();
        const teacherX = centerX(nodes.teacher);
        const teacherManagerX = centerX(nodes.teacherManager);
        setBox(
          links['teacher-manager-teacher'],
          teacherX,
          teacherRect.bottom - stageRect.top,
          teacherManagerX - teacherX,
          shortLoopHeight
        );
        const teacherLoop = links['teacher-manager-teacher'];
        const teacherLoopWidth = teacherManagerX - teacherX;
        teacherLoop?.querySelector('svg')?.setAttribute('viewBox', `0 0 ${teacherLoopWidth} ${shortLoopHeight}`);
        teacherLoop?.querySelector('path')?.setAttribute('d', `M ${teacherLoopWidth} 0 V 18 Q ${teacherLoopWidth} ${shortLoopHeight} ${teacherLoopWidth - 8} ${shortLoopHeight} H 8 Q 0 ${shortLoopHeight} 0 18 V 0`);
        const takeoverLink = links['student-manager-teacher'];
        const takeoverWidth = studentManagerX - teacherX;
        const takeoverHeight = teacherRect.top - studentManagerRect.bottom;
        setBox(
          takeoverLink,
          teacherX,
          studentManagerRect.bottom - stageRect.top,
          takeoverWidth,
          takeoverHeight
        );
        const takeoverPath = takeoverLink?.querySelector('[data-ad-takeover-path]');
        const bendY = takeoverHeight / 2;
        const radius = Math.min(8, takeoverWidth / 4, takeoverHeight / 4);
        takeoverLink?.querySelector('svg')?.setAttribute('viewBox', `0 0 ${takeoverWidth} ${takeoverHeight}`);
        takeoverPath?.setAttribute(
          'd',
          `M ${takeoverWidth} 0 V ${bendY - radius} Q ${takeoverWidth} ${bendY} ${takeoverWidth - radius} ${bendY} H ${radius} Q 0 ${bendY} 0 ${bendY + radius} V ${takeoverHeight}`
        );
      }
    };

    const clearTimers = () => {
      timers.forEach(window.clearTimeout);
      timers = [];
    };

    const resetVisuals = () => {
      Object.values(nodes).forEach((node) => node.classList.remove('is-active', 'is-complete', 'is-success', 'is-failure', 'is-triggered'));
      Object.values(links).forEach((link) => link.classList.remove('is-complete'));
      event.classList.remove('is-alert', 'is-success');
      nodes.outcome.querySelector('.autodagger-node-icon').textContent = currentScenario === 'teacher-success' ? '✓' : '×';
    };

    const renderFrames = (scenario) => {
      frameStrip.replaceChildren(...scenario.frames.map((kind) => {
        const frame = document.createElement('span');
        frame.className = `autodagger-frame is-${kind}`;
        return frame;
      }));
    };

    const revealFrame = (index) => {
      const frames = Array.from(frameStrip.children);
      frames.forEach((frame) => frame.classList.remove('is-current'));
      frames[index]?.classList.add('is-visible', 'is-current');
    };

    const framePhase = (scenario, kind) => {
      if (kind === 'student') {
        return {
          event: 'Monitoring student execution',
          active: ['student', 'monitor', 'studentManager'],
          links: ['student-monitor', 'monitor-student-manager', 'student-manager-student'],
          studentManagerLabel: 'Continue execution'
        };
      }
      if (kind === 'intervention') {
        return {
          event: 'Student failure · teacher takeover',
          alert: true,
          failureDecision: true,
          active: ['studentManager'],
          links: ['monitor-student-manager', 'student-manager-teacher'],
          studentManagerLabel: 'Teacher takeover'
        };
      }
      if (kind === 'teacher') {
        return {
          event: 'Monitoring teacher recovery',
          active: ['teacher', 'teacherMonitor', 'teacherManager'],
          links: ['teacher-teacher-monitor', 'teacher-monitor-teacher-manager', 'teacher-manager-teacher'],
          studentManagerLabel: 'Teacher takeover',
          teacherLabel: scenario.teacherLabel,
          teacherMonitorLabel: 'Tracking execution',
          teacherManagerLabel: 'Continue recovery'
        };
      }
      return {
        event: 'Teacher failure',
        alert: true,
        failureDecision: true,
        active: ['teacherManager'],
        links: ['teacher-monitor-teacher-manager'],
        studentManagerLabel: 'Teacher takeover',
        teacherLabel: scenario.teacherLabel,
        teacherMonitorLabel: 'Tracking execution',
        teacherManagerLabel: 'Teacher failure'
      };
    };

    const renderPhase = (phase) => {
      resetVisuals();
      (phase.active || []).forEach((key) => nodes[key]?.classList.add('is-active'));
      (phase.complete || []).forEach((key) => nodes[key]?.classList.add('is-complete'));
      if (phase.failureDecision) {
        (phase.active || []).filter((key) => key.endsWith('Manager')).forEach((key) => nodes[key]?.classList.add('is-triggered', 'has-triggered'));
      }
      (phase.links || []).forEach((key) => links[key]?.classList.add('is-complete'));
      if ((phase.links || []).includes('student-manager-teacher')) {
        links['student-manager-teacher']?.classList.add('has-appeared');
      }
      if (phase.outcome) {
        const retained = phase.outcome === 'success';
        nodes.outcome.classList.add('is-active', retained ? 'is-success' : 'is-failure');
        nodes.outcome.querySelector('.autodagger-node-icon').textContent = phase.outcome === 'success' ? '✓' : '×';
      }
      const showOutcome = Boolean(phase.outcome);
      nodes.outcome.classList.toggle('is-concealed', !showOutcome);
      links['student-manager-outcome']?.classList.toggle('is-concealed', !showOutcome);
      links['teacher-manager-outcome']?.classList.toggle('is-concealed', !showOutcome);
      eventText.textContent = phase.event;
      event.classList.toggle('is-alert', Boolean(phase.alert));
      event.classList.toggle('is-success', Boolean(phase.successEvent));
      monitorLabel.textContent = 'Tracking execution';
      teacherLabel.textContent = phase.teacherLabel || 'Waiting';
      teacherMonitorLabel.textContent = phase.teacherMonitorLabel || 'Waiting';
      studentManagerLabel.textContent = phase.studentManagerLabel || 'Continue execution';
      teacherManagerLabel.textContent = phase.teacherManagerLabel || 'Waiting';
    };

    const playScenario = (name, userInitiated = false) => {
      clearTimers();
      currentScenario = name;
      const scenario = scenarios[name];
      demo.dataset.scenario = name;
      Object.values(nodes).forEach((node) => node.classList.remove('has-triggered'));
      links['student-manager-teacher']?.classList.remove('has-appeared');
      window.requestAnimationFrame(() => window.requestAnimationFrame(updateConnectorGeometry));
      buttons.forEach((button) => {
        const active = button.dataset.autodaggerScenario === name;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      studentLabel.textContent = 'Executing task';
      teacherLabel.textContent = 'Waiting';
      teacherMonitorLabel.textContent = 'Waiting';
      studentManagerLabel.textContent = 'Continue execution';
      teacherManagerLabel.textContent = 'Waiting';
      outcomeTitle.textContent = scenario.outcomeTitle;
      outcomeLabel.textContent = scenario.outcomeLabel;
      nodes.outcome.classList.add('is-concealed');
      links['student-manager-outcome']?.classList.add('is-concealed');
      links['teacher-manager-outcome']?.classList.add('is-concealed');
      trajectoryResult.textContent = '';
      renderFrames(scenario);
      const stepDuration = 850;
      scenario.frames.forEach((kind, index) => {
        const delay = reducedMotion ? 0 : index * stepDuration;
        timers.push(window.setTimeout(() => {
          renderPhase(framePhase(scenario, kind));
          revealFrame(index);
        }, delay));
      });
      const finalPhase = scenario.finalPhase;
      const finalDelay = reducedMotion ? 0 : scenario.frames.length * stepDuration;
      const outcomeDelay = reducedMotion ? 0 : 650;
      const summaryDelay = reducedMotion ? 0 : 500;
      timers.push(window.setTimeout(() => {
        renderPhase({
          ...finalPhase,
          event: finalPhase.event.split(' · ')[0],
          outcome: undefined,
          complete: [],
          links: []
        });
      }, finalDelay));
      timers.push(window.setTimeout(() => {
        const retained = finalPhase.outcome === 'success';
        renderPhase({
          ...finalPhase,
          event: retained ? 'Retain trajectory' : 'Discard trajectory',
          successEvent: retained,
          alert: !retained,
          complete: [],
          links: (finalPhase.links || []).filter((key) => key.endsWith('-outcome'))
        });
        trajectoryResult.textContent = scenario.result;
        frameStrip.querySelectorAll('.autodagger-frame').forEach((frame) => frame.classList.remove('is-current'));
        if (scenario.discarded) {
          frameStrip.querySelectorAll('.autodagger-frame').forEach((frame) => frame.classList.add('is-discarded'));
        }
      }, finalDelay + outcomeDelay));
      timers.push(window.setTimeout(() => {
        const retained = finalPhase.outcome === 'success';
        renderPhase({
          ...finalPhase,
          event: retained ? 'Retain trajectory' : 'Discard trajectory',
          successEvent: retained,
          alert: !retained
        });
      }, finalDelay + outcomeDelay + summaryDelay));
      if (!reducedMotion && inViewport && !userInitiated) {
        const next = scenarioOrder[(scenarioOrder.indexOf(name) + 1) % scenarioOrder.length];
        timers.push(window.setTimeout(() => playScenario(next), finalDelay + outcomeDelay + summaryDelay + 1800));
      }
    };

    buttons.forEach((button) => button.addEventListener('click', () => playScenario(button.dataset.autodaggerScenario, true)));
    if ('ResizeObserver' in window && stage) {
      new ResizeObserver(updateConnectorGeometry).observe(stage);
    } else {
      window.addEventListener('resize', updateConnectorGeometry);
    }
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => {
        inViewport = entry.isIntersecting;
        if (inViewport) playScenario(currentScenario);
        else clearTimers();
      }, { threshold: 0.3 });
      observer.observe(demo);
    } else {
      inViewport = true;
      playScenario(currentScenario);
    }
  });

  const autoplayVideos = document.querySelectorAll('.task-video-showcase video[data-autoplay]');
  if (!autoplayVideos.length || !('IntersectionObserver' in window)) {
    return;
  }

  const playbackObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ target: video, isIntersecting }) => {
      video.dataset.inViewport = String(isIntersecting);
      if (canAutoplayVideo(video)) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.35 });

  autoplayVideos.forEach((video) => playbackObserver.observe(video));
});
