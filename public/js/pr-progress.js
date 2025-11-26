document.addEventListener('DOMContentLoaded', () => {
    const prListContainer = document.getElementById('pr-list');
    let prDataCache = []; // Cache to compare for updates

    // --- Main Function to Fetch and Render Data ---
    const fetchAndRenderPRs = async () => {
        try {
            const response = await fetch('/api/pr-progress/today');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const prs = await response.json();
            prDataCache = prs; // Update cache
            renderPRs(prs);
        } catch (error) {
            console.error("Failed to fetch PR data:", error);
            prListContainer.innerHTML = '<p>Error loading data. Please try again later.</p>';
        }
    };

    // --- Renders PR data into the DOM ---
    const renderPRs = (prs) => {
        prListContainer.innerHTML = ''; // Clear previous content
        if (prs.length === 0) {
            prListContainer.innerHTML = '<p>No PRs scheduled for today.</p>';
            return;
        }

        prs.forEach(pr => {
            const card = document.createElement('div');
            card.className = 'pr-card';
            card.dataset.prId = pr.pr_id;

            const overallStatus = getOverallStatus(pr);
            const remakeQty = pr.actual_quantity < pr.planned_quantity ? pr.planned_quantity - pr.actual_quantity : 0;

            card.innerHTML = `
                <h3>${pr.pr_id} <span class="status-${overallStatus.toLowerCase()}">${overallStatus}</span></h3>
                <p><strong>POP Status:</strong> ${pr.status_pop}</p>
                <p><strong>Quantity:</strong> ${pr.actual_quantity} / ${pr.planned_quantity} ${remakeQty > 0 ? `(Remake: ${remakeQty})` : ''}</p>
                <div class="confirmation-buttons">
                    ${createButtonHTML('TO_WASH', 'Confirm to Wash', pr.confirmations.TO_WASH)}
                    ${createButtonHTML('TO_DYE', 'Confirm to Dye', pr.confirmations.TO_DYE)}
                </div>
            `;
            prListContainer.appendChild(card);
        });
    };

    // --- Helper to create button HTML ---
    const createButtonHTML = (stepName, buttonText, confirmedTimestamp) => {
        if (confirmedTimestamp) {
            return `<button class="confirmed" disabled>${buttonText} (Confirmed at ${new Date(confirmedTimestamp).toLocaleTimeString()})</button>`;
        }
        return `<button data-step-name="${stepName}">${buttonText}</button>`;
    };

    // --- Helper to determine overall status ---
    const getOverallStatus = (pr) => {
        const today = new Date().setHours(0, 0, 0, 0);
        const plannedCompletion = new Date(pr.planned_completion_date).setHours(0, 0, 0, 0);

        if (pr.actual_completion_date) {
            const actualCompletion = new Date(pr.actual_completion_date).setHours(0, 0, 0, 0);
            return actualCompletion > plannedCompletion ? 'DELAY' : 'OK';
        } else if (today > plannedCompletion) {
            return 'DELAY';
        }
        return 'OK';
    };


    // --- Event Delegation for Confirmation Buttons ---
    prListContainer.addEventListener('click', async (event) => {
        if (event.target.tagName === 'BUTTON' && event.target.dataset.stepName) {
            const button = event.target;
            const prId = button.closest('.pr-card').dataset.prId;
            const stepName = button.dataset.stepName;

            button.disabled = true;
            button.textContent = 'Confirming...';

            await confirmStep(prId, stepName);
        }
    });

    // --- Function to send confirmation to the backend ---
    const confirmStep = async (prId, stepName) => {
        try {
            const response = await fetch('/api/pr-progress/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pr_id: prId, step_name: stepName })
            });

            if (!response.ok) {
                throw new Error('Confirmation failed');
            }

            // Refresh data to show the update
            await fetchAndRenderPRs();

        } catch (error) {
            console.error(`Failed to confirm step ${stepName} for PR ${prId}:`, error);
            // Re-enable button on failure
            const button = prListContainer.querySelector(`[data-pr-id="${prId}"] button[data-step-name="${stepName}"]`);
            if(button) {
                button.disabled = false;
                button.textContent = `Confirm to ${stepName.split('_')[1].toLowerCase()}`;
            }
        }
    };

    // --- Initial Load and Periodic Refresh ---
    fetchAndRenderPRs();
    setInterval(fetchAndRenderPRs, 30000); // Refresh every 30 seconds
});
