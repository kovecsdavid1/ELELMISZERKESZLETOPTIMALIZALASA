async function uploadCSV() {
    const file = document.getElementById('csvFile').files[0];
    if (!file) return alert('Válassz ki egy CSV fájlt!');
    const reader = new FileReader();
    reader.onload = async (e) => {
        const text = e.target.result;
        const rows = text.split('\n').slice(1).filter(row => row.trim() !== '');
        const data = rows.map(row => {
            const cells = row.split(',');
            if (cells.length < 3) return null;
            const name = cells[0]?.trim() || '';
            const quantity = parseInt(cells[1]?.trim() || '0');
            const expiryDate = cells[2]?.trim() || '';
            return { Name: name, Quantity: quantity, ExpiryDate: expiryDate };
        }).filter(item => item !== null && item.Name);

        try {
            const response = await fetch('https://localhost:7142/FoodItem', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            displayResults(result);
        } catch (error) {
            alert(`Hiba: ${error.message}`);
        }
    };
    reader.readAsText(file);
}

function request() {
    
}

function displayResults(result) {
    const resultsDiv = document.getElementById('results');

    const prioritized = Array.isArray(result.Prioritized) ? result.Prioritized : [];
    const consumptionRates = Array.isArray(result.ConsumptionRates) ? result.ConsumptionRates : [];
    const expiringSoon = result.Recommendations && Array.isArray(result.Recommendations.ExpiringSoon) ? result.Recommendations.ExpiringSoon : [];
    const highConsumption = result.Recommendations && Array.isArray(result.Recommendations.HighConsumption) ? result.Recommendations.HighConsumption : [];

    resultsDiv.innerHTML = `
        <div class="card mb-4">
            <div class="card-header bg-primary text-white">
                <h5>Prioritási lista (lejárati dátum szerint)</h5>
            </div>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Név</th>
                        <th>Mennyiség</th>
                        <th>Lejárati dátum</th>
                    </tr>
                </thead>
                <tbody>
                    ${prioritized.map(f => `<tr><td>${f.Name}</td><td>${f.Quantity ?? ''}</td><td>${f.ExpiryDate}</td></tr>`).join('')}
                </tbody>
            </table>
        </div>

        <div class="card mb-4">
            <div class="card-header bg-info text-white">
                <h5>Havi felhasználási arányok</h5>
            </div>
            <table class="table">
                <thead>
                    <tr>
                        <th>Termék</th>
                        <th>Egység/hó</th>
                    </tr>
                </thead>
                <tbody>
                    ${consumptionRates.map(cr => `<tr><td>${cr.Name}</td><td>${cr.Rate.toFixed(2)}</td></tr>`).join('')}
                </tbody>
            </table>
        </div>

        <div class="card">
            <div class="card-header bg-warning">
                <h5>Vásárlási javaslatok</h5>
            </div>
            <div class="card-body">
                <div class="alert alert-danger mb-3">
                    <strong>Pótlandó (7 napon belül lejár):</strong><br>
                    ${expiringSoon.length ? expiringSoon.join(', ') : 'Nincs ilyen termék'}
                </div>
                <div class="alert alert-success">
                    <strong>Új vásárlás (nagy fogyasztás):</strong><br>
                    ${highConsumption.length ? highConsumption.join(', ') : 'Nincs ilyen termék'}
                </div>
            </div>
        </div>
    `;
    resultsDiv.style.display = 'block';
}
