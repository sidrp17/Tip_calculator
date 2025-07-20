// script.js

// ===========================================
//           DOM Element Selection
// ===========================================
// (Your element selection code is here, including resetButton)
const billInput = document.getElementById('bill');
const tipButtons = document.querySelectorAll('tip-percent-btn');
const customTipInput = document.getElementById('custom-tip');
const peopleInput = document.getElementById('num-people'); // Used here
const tipAmountDisplay = document.getElementById('tip-amount-display');
const totalAmountDisplay = document.getElementById('total-amount-display');
const resetButton = document.getElementById('reset-btn');

// ===========================================
//           Event Listeners
// ===========================================
// Listener for bill input
billInput.addEventListener('input', calculateTip);

// Listeners for tip percentage buttons
tipButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        // Remove 'active' class from all buttons
        tipButtons.forEach(btn => btn.classList.remove('active'));
        // Add 'active' class to the clicked button
        event.target.classList.add('active');
        // Clear the custom tip input when a button is selected
        if (customTipInput) {
            customTipInput.value = '';
        }
        calculateTip(); // Recalculate and update error styles
    });
});

// Listener for custom tip input
customTipInput.addEventListener('input', () => {
    // Remove 'active' class from all buttons when custom tip is used
    tipButtons.forEach(btn => btn.classList.remove('active'));
    calculateTip(); // Recalculate and update error styles
});

// Listener for number of people input
peopleInput.addEventListener('input', calculateTip);

// Listener for the Reset button
if (resetButton) {
    resetButton.addEventListener('click', () => {
        console.log('Reset button clicked! Calling resetCalculator().');
        resetCalculator(); // Call the function to perform reset actions
    });
} else {
    console.error('Error: Reset button element not found. Cannot add event listener.');
}

// ===========================================
//             Core Functions
// ===========================================

// calculateTip function
function calculateTip() {
    // --- 1. Retrieve Input Values (Strings) ---
    const billValueStr = billInput.value;
    const peopleValueStr = peopleInput.value;
    const customTipValueStr = customTipInput.value;
    
    // --- 2. Convert to Numbers ---
    const billAmount = parseFloat(billValueStr);
    const numberOfPeople = parseFloat(peopleValueStr);
    const customTipPercent = parseFloat(customTipValueStr);

    // ===========================================================
    // --- 3. INPUT VALIDATION SECTION ---
    // ===========================================================
    const isBillValid = !isNaN(billAmount) && billAmount >= 0;
    const isPeopleValid = !isNaN(numberOfPeople) && numberOfPeople > 0 && Number.isInteger(numberOfPeople);
    // Validation for custom tip *input field* (for styling)
    const isCustomTipInputValid = customTipValueStr === '' || (!isNaN(customTipPercent) && customTipPercent >= 0);

    // --- 4. Determine Tip Percentage to Use ---
    let actualTipPercent = 0;
    // Prioritize valid custom input if it's not empty
    if (customTipValueStr !== '' && !isNaN(customTipPercent) && customTipPercent >= 0) {
         actualTipPercent = customTipPercent;
    } else if (customTipValueStr === '') { // If custom input is empty, check buttons
        const activeButton = document.querySelector('.tip-percent-btn.active');
        if (activeButton) {
            const selectedButtonTipPercent = parseFloat(activeButton.dataset.tip);
            if (!isNaN(selectedButtonTipPercent) && selectedButtonTipPercent >= 0) {
                actualTipPercent = selectedButtonTipPercent;
            }
        }
    }
    // Validate the *effective* tip percentage
    const isTipValid = !isNaN(actualTipPercent) && actualTipPercent >= 0;

    // --- 5. Calculate Total Tip ---
    let totalTipAmount = 0; 
    if (isBillValid && isTipValid) {
        totalTipAmount = billAmount * (actualTipPercent / 100);
    }

    // --- 6. Calculate Total Bill ---
    let totalBillAmount = 0; 
    if (isBillValid) { 
        totalBillAmount = billAmount + totalTipAmount;
    }
    
    // --- 7. Calculate Per-Person Amounts ---
    let tipAmountPerPerson = 0;    
    let totalAmountPerPerson = 0;  
    if (isBillValid && isTipValid && isPeopleValid) {
        if (!isNaN(totalBillAmount)) { 
            tipAmountPerPerson = totalTipAmount / numberOfPeople;
            totalAmountPerPerson = totalBillAmount / numberOfPeople;
        } else {
             tipAmountPerPerson = 0;
             totalAmountPerPerson = 0;
        }
    } else {
        // Optional: console.warn specific messages based on which validation failed
    }

    // --- 8. Format Results for Display ---
    const formattedTipAmount = tipAmountPerPerson.toFixed(2);
    const formattedTotalAmount = totalAmountPerPerson.toFixed(2);
    const displayTipAmount = `$${formattedTipAmount}`;
    const displayTotalAmount = `$${formattedTotalAmount}`;

    // --- 9. Update DOM Text Content ---
    if (tipAmountDisplay) {
        tipAmountDisplay.textContent = displayTipAmount;
    }
    if (totalAmountDisplay) {
        totalAmountDisplay.textContent = displayTotalAmount;
    }

    // --- 10. Apply Visual Feedback (Error Styling) ---
    if (billInput) {
        billInput.classList.toggle('error', !isBillValid);
    }
    if (peopleInput) {
        peopleInput.classList.toggle('error', !isPeopleValid);
    }
    if (customTipInput) {
        const activeButton = document.querySelector('.tip-percent-btn.active');
        let showErrorForCustomTip = !isCustomTipInputValid;
        if (customTipInput.value === '' && activeButton) {
            showErrorForCustomTip = false; 
        }
        customTipInput.classList.toggle('error', showErrorForCustomTip);
    }
}
//========================================================
// --- Definition for the Reset Calculator Function ---
//========================================================
/**
 * @function resetCalculator
 * @description Resets all input fields, calculated values, and visual states
 *              of the tip calculator to their initial default settings.
 */
function resetCalculator() {
    // 1. Set the value of the bill input to empty.
    if (billInput) {
        billInput.value = '';
        // console.log('Bill input field reset to empty.'); 
    } /* else {
        console.error('Error: billInput element not found, cannot reset its value.');
    } */

    // 2. Clear the custom tip input value.
    if (customTipInput) {
        customTipInput.value = '';
        // console.log('Custom tip input field reset to empty.');
    } /* else {
        console.error('Error: customTipInput element not found, cannot reset its value.');
    } */

    // 3. Deselect any active tip percentage buttons.
    if (tipButtons && tipButtons.length > 0) {
        tipButtons.forEach(button => {
            button.classList.remove('active');
        });
        // console.log('Active class removed from all tip buttons.');
    } /* else if (tipButtons) {
        // console.log('No tip buttons found to deselect, or tipButtons NodeList is empty.');
    } else {
        console.error('Error: tipButtons NodeList not found, cannot deselect buttons.');
    } */

    // 4. Set the value of the number of people input to empty.
    //    This allows the placeholder text (if any) to become visible.
    //    Alternatively, you could set it to '1' for a default of one person.
    if (peopleInput) { // Check if the peopleInput element was successfully selected
        peopleInput.value = ''; // Set its value to an empty string
        console.log('Number of People input field reset to empty.');
    } /* else {
        console.error('Error: peopleInput element not found, cannot reset its value.');
    } */

  // 5. Reset the text content of the tip amount/person display to '$0.00'.
    if (tipAmountDisplay) { // Check if the tipAmountDisplay element was successfully selected
        tipAmountDisplay.textContent = '$0.00'; // Set its text content
        console.log('Tip Amount / person display reset to $0.00.');
    } /* else {
        console.error('Error: tipAmountDisplay element not found, cannot reset its text content.');
    } */
     // 6. Reset the text content of the total/person display to '$0.00'.
    if (totalAmountDisplay) { // Check if the totalAmountDisplay element was successfully selected
        totalAmountDisplay.textContent = '$0.00'; // Set its text content
        //console.log('Total / person display reset to $0.00.');
    } /* else {
        console.error('Error: totalAmountDisplay element not found, cannot reset its text content.');
    } */

    // 7. Remove any validation error styling.
     if (billInput) {
        billInput.classList.remove('error');
       // console.log('Error styling removed from bill input.');
    }
    if (customTipInput) {
        customTipInput.classList.remove('error');
        //console.log('Error styling removed from custom tip input.');
    }
    if (peopleInput) {
        peopleInput.classList.remove('error');
        //console.log('Error styling removed from people input.');
    }

    console.log('Calculator has been fully reset.');
}

// ===========================================
//           Initial Execution
// ===========================================
document.addEventListener('DOMContentLoaded', () => {
    calculateTip(); 
});