let inventory = [];

function addItem() {
    const name = document.getElementById('itemName').value.trim();
    const quantity = parseInt(document.getElementById('itemQuantity').value);
    const expiry = document.getElementById('itemExpiry').value;

    if (!name || isNaN(quantity) || !expiry) {
        alert("Töltsd ki minden mezőt!");
        return;
    }

    inventory.push({
        Name: name,
        Quantity: quantity,
        ExpiryDate: expiry
    });

    updateInventoryTable();
    clearInputs();
}

function updateInventoryTable() {
    const tbody = document.querySelector('#inventoryTable tbody');
    tbody.innerHTML = inventory.map((item, index) => `
        <tr>
            <td>${item.Name}</td>
            <td>${item.Quantity}</td>
            <td>${item.ExpiryDate}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deleteItem(${index})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function deleteItem(index) {
    inventory.splice(index, 1);
    updateInventoryTable();
}

async function submitData() {
    fetch('https://localhost:7142/FoodItem', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(inventory)
    })
    .then(response => response.json())
    .then(data => {
        displayResults(data)
    })
    .catch(error => {
        console.error('Hiba történt a kérés során:', error);
    });
}

function displayResults(result) {
    const resultsDiv = document.getElementById('results');
    console.log(result)
    console.log(result.prioritized)
    console.log(result.consumptionRates)
    console.log(result.recommendations?.expiringSoon)
    console.log(result.recommendations?.highConsumption)
    const prioritized = result.prioritized ?? [];
    const consumptionRates = result.consumptionRates ?? [];
    const expiringSoon = result.recommendations?.expiringSoon ?? [];
    const highConsumption = result.recommendations?.highConsumption ?? [];

    resultsDiv.innerHTML = `
        <div class="card mb-4">
            <div class="card-header bg-primary text-white">
                <h5>Prioritási lista</h5>
            </div>
            <table class="table">
                <tbody>
                    ${prioritized.map(f => `
                        <tr><td>${f.name}</td><td>${f.expiryDate}</td></tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div class="card mb-4">
            <div class="card-header bg-info text-white">
                <h5>Havi fogyasztási arány</h5>
            </div>
            <table class="table">
                <tbody>
                    ${consumptionRates.map(cr => `
                        <tr><td>${cr.name}</td><td>${cr.rate?.toFixed(2) ?? 0} egység/hó</td></tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div class="card mb-4">
            <div class="card-header bg-info text-white">
                <h5>Javasolt vásárolandó termékek lejárat alapján</h5>
            </div>
                <ul>
                    ${expiringSoon.map(es => `
                        <li>${es}</li>
                    `).join('')}
                </ul>
        </div>

        <div class="card mb-4">
            <div class="card-header bg-info text-white">
                <h5>Javasolt vásárolandó termékek felhasználás alapján</h5>
            </div>
                <ul>
                    ${highConsumption.map(hc => `
                        <li>${hc}</li>
                    `).join('')}
                </ul>
        </div>


    `;
}

function clearInputs() {
    document.getElementById('itemName').value = '';
    document.getElementById('itemQuantity').value = '';
    document.getElementById('itemExpiry').value = '';
}
