// Basic protein intake logic and UI interactions
(function(){
  const $ = id => document.getElementById(id);
  const weightInput = $('weightInput');
  const weightUnit = $('weightUnit');
  const activity = $('activity');
  const goal = $('goal');
  const calculateBtn = $('calculateBtn');
  const resetBtn = $('resetBtn');
  const downloadBtn = $('downloadBtn');
  const resultDetails = $('resultDetails');
  const targetGrams = $('targetGrams');
  const perKg = $('perKg');
  const servingList = $('servingList');

  // Factors (g/kg) we will use as a recommended target median
  const factors = {
    maintenance: 1.0,
    weight_loss: 1.5,
    muscle_gain: 1.8
  };

  function lbsToKg(lbs){ return lbs * 0.45359237; }

  function clearResult(){
    resultDetails.classList.add('hidden');
    targetGrams.textContent = '—';
    perKg.textContent = '—';
    servingList.innerHTML = '';
  }

  function formatNumber(n){ return Math.round(n*10)/10; }

  function generateServings(proteinGrams){
    // simple examples of protein-rich servings (approx values)
    const foods = [
      {name:'Chicken breast (100g)', protein:31},
      {name:'Cooked lentils (1 cup)', protein:18},
      {name:'Greek yogurt (200g)', protein:20},
      {name:'Eggs (2 large)', protein:12},
      {name:'Salmon (100g)', protein:25},
      {name:'Protein powder (1 scoop)', protein:25}
    ];

    // Show practical serving combinations to reach target
    let html = '';
    
    // Calculate servings needed and show practical combinations
    foods.forEach(f => {
      const servingsNeeded = proteinGrams / f.protein;
      
      if (servingsNeeded <= 4) {
        // Show exact servings for reasonable amounts
        const roundedServings = Math.round(servingsNeeded * 2) / 2; // Round to nearest 0.5
        const servingText = roundedServings === 1 ? 'serving' : 'servings';
        const totalProtein = Math.round(roundedServings * f.protein);
        html += `<li>${roundedServings} ${servingText} of ${f.name} = ${totalProtein}g protein</li>`;
      } else {
        // For foods that would need too many servings, show contribution instead
        const contribution = Math.round((f.protein / proteinGrams) * 100);
        html += `<li>1 serving of ${f.name} = ${f.protein}g protein (${contribution}% of daily target)</li>`;
      }
    });
    
    return html;
  }

  function calculate(){
    const raw = parseFloat(weightInput.value);
    if(!raw || raw <= 0){ alert('Please enter a valid weight.'); return; }
    let kg = weightUnit.value === 'lb' ? lbsToKg(raw) : raw;
    kg = Math.round(kg*10)/10;
    const chosenGoal = goal.value;
    const factor = factors[chosenGoal] || 1.0;
    const grams = formatNumber(kg * factor);
    targetGrams.textContent = grams;
    perKg.textContent = formatNumber(grams / kg);
    servingList.innerHTML = generateServings(grams);
    resultDetails.classList.remove('hidden');

    // Logging to data-attributes for download
    resultDetails.dataset.grams = grams;
    resultDetails.dataset.perkg = formatNumber(grams/kg);
    resultDetails.dataset.kg = kg;
    resultDetails.dataset.goal = chosenGoal;
  }

  calculateBtn.addEventListener('click', calculate);
  resetBtn.addEventListener('click', function(){
    weightInput.value = '';
    weightUnit.value = 'kg';
    activity.value = 'sedentary';
    goal.value = 'maintenance';
    clearResult();
  });

  downloadBtn.addEventListener('click', function(){
    if(resultDetails.classList.contains('hidden')){ alert('Please calculate first.'); return; }
    const data = {
      weightKg: resultDetails.dataset.kg,
      perKg: resultDetails.dataset.perkg,
      targetGrams: resultDetails.dataset.grams,
      goal: resultDetails.dataset.goal
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'protein-intake-result.json';
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  });

  // small accessibility: allow Enter to calculate when focused inside form
  document.getElementById('proteinForm').addEventListener('keydown', function(e){
    if(e.key === 'Enter'){
      e.preventDefault(); calculate();
    }
  });

})();
