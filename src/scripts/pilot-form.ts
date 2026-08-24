const form = document.querySelector<HTMLFormElement>('[data-pilot-form]');

if (form) {
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]');
  const status = form.querySelector<HTMLElement>('[data-status]');
  const jsRequired = form.querySelector<HTMLElement>('[data-js-required]');
  const endpoint = form.dataset.endpoint?.trim() ?? '';
  const contactEmail = form.dataset.email?.trim() ?? '';
  const touched = new Set<string>();

  const setStatus = (message: string, tone: 'neutral' | 'error' | 'success' = 'neutral') => {
    if (!status) return;
    status.textContent = message;
    status.dataset.tone = tone;
  };

  const setButtonState = (state: 'idle' | 'loading' | 'error' | 'success') => {
    if (!submit) return;
    submit.dataset.state = state === 'idle' ? '' : state;
    submit.disabled = state === 'loading';
    submit.setAttribute('aria-disabled', String(submit.disabled));
    submit.textContent = state === 'loading'
      ? 'Sending application…'
      : state === 'success'
        ? 'Application prepared ✓'
        : state === 'error'
          ? 'Try again'
          : 'Apply for the pilot';
  };

  setButtonState('idle');
  if (jsRequired) jsRequired.hidden = true;

  const validate = (input: HTMLInputElement) => {
    const helper = document.getElementById(`${input.id}-help`);
    const empty = input.required && input.value.trim() === '';
    const invalidEmail = input.type === 'email' && input.value.trim() !== '' && !input.validity.valid;
    const invalid = empty || invalidEmail;

    input.setAttribute('aria-invalid', String(invalid));
    if (helper) {
      if (empty) helper.textContent = 'Add this detail so we can arrange the pilot.';
      else if (invalidEmail) helper.textContent = 'Use a complete email address, such as name@business.com.au.';
      else helper.textContent = input.id === 'email'
        ? 'Used only to arrange the founding pilot.'
        : 'The name you want shown on client reports.';
      helper.dataset.tone = invalid ? 'error' : 'neutral';
    }
    return !invalid;
  };

  for (const input of form.querySelectorAll<HTMLInputElement>('input[required]')) {
    input.addEventListener('blur', () => {
      touched.add(input.name);
      validate(input);
    });
    input.addEventListener('input', () => {
      if (touched.has(input.name)) validate(input);
    });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);

    if (String(data.get('website') ?? '').trim()) return;

    const requiredInputs = [...form.querySelectorAll<HTMLInputElement>('input[required]')];
    requiredInputs.forEach((input) => touched.add(input.name));
    if (!requiredInputs.every(validate)) {
      setButtonState('error');
      setStatus('Two details need attention before the application can be prepared.', 'error');
      requiredInputs.find((input) => input.getAttribute('aria-invalid') === 'true')?.focus();
      return;
    }

    const payload = {
      businessName: String(data.get('businessName') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      siteCount: String(data.get('siteCount') ?? ''),
      source: 'wrapsheet-landing-page',
    };

    setButtonState('loading');
    setStatus('Preparing your pilot request…');

    try {
      if (endpoint) {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error(`Pilot endpoint returned ${response.status}`);
        setButtonState('success');
        setStatus('Application received. We’ll reply with the pilot setup steps.', 'success');
        form.reset();
        return;
      }

      if (contactEmail) {
        const subject = encodeURIComponent(`Wrapsheet pilot — ${payload.businessName}`);
        const body = encodeURIComponent(`Business: ${payload.businessName}\nEmail: ${payload.email}\nActive sites: ${payload.siteCount}`);
        window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
        setButtonState('success');
        setStatus('Your email app should now have a prepared pilot application.', 'success');
        return;
      }

      setButtonState('error');
      setStatus('The pilot inbox is not connected yet. Please check back before the public launch.', 'error');
    } catch {
      setButtonState('error');
      setStatus('The application could not be sent. Check your connection and try again.', 'error');
    }
  });
}
