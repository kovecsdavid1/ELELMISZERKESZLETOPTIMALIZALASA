async function uploadCSV() {
    const file = document.getElementById('csvFile').files[0];
    if (!file) return alert('Válassz ki egy CSV fájlt!');
    const reader = new FileReader();
    reader.onload = async (e) => {
        const text = e.target.result;
        // Fejléc kihagyása, üres sorok szűrése, sorvégző karakterek kezelése
        const rows = text.split('\n').slice(1).filter(row => row.trim() !== '');
        const data = rows.map(row => {
            const cells = row.split(',');
            if (cells.length < 3) return null; // Ha nincs 3 mező, kihagyjuk
            const name = cells[0]?.trim() || '';
            const quantity = parseInt(cells[1]?.trim() || '0');
            const expiryDate = cells[2]?.trim() || '';
            return { Name: name, Quantity: quantity, ExpiryDate: expiryDate };
        }).filter(item => item !== null && item.Name); // Üres és hibás sorok szűrése

        // Küldés a backendnek
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
