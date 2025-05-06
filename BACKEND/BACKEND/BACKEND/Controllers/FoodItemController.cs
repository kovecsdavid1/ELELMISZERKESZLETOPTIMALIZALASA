using BACKEND.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FoodItemController : ControllerBase
    {
        [HttpPost]
        public IActionResult OptimizeInventory([FromBody] List<FoodItem> foodItems)
        {
            try
            {
                // 1. Hibás dátumok kiszűrése
                var validItems = foodItems
                    .Where(f => DateTime.TryParse(f.ExpiryDate, out _))
                    .ToList();

                // 2. Prioritizálás
                var prioritized = validItems
                    .OrderBy(f => DateTime.Parse(f.ExpiryDate))
                    .Select(f => new { f.Name, f.ExpiryDate })
                    .ToList();

                // 3. Fogyasztási arány
                var consumptionRates = validItems.Select(f =>
                {
                    var expiryDate = DateTime.Parse(f.ExpiryDate);
                    var daysLeft = (expiryDate - DateTime.Now).Days;
                    daysLeft = daysLeft <= 0 ? 1 : daysLeft; // Nullával ne osszunk
                    var rate = Math.Round((f.Quantity / (double)daysLeft) * 30, 2);
                    return new { f.Name, Rate = rate };
                }).ToList();

                // 4. Javaslatok
                var expiringSoon = validItems
                    .Where(f => (DateTime.Parse(f.ExpiryDate) - DateTime.Now).Days <= 7)
                    .Select(f => f.Name)
                    .ToList();

                var highConsumption = consumptionRates
                    .Where(cr => cr.Rate > 5)
                    .Select(cr => cr.Name)
                    .ToList();

                return Ok(new
                {
                    Prioritized = prioritized,
                    ConsumptionRates = consumptionRates,
                    Recommendations = new { ExpiringSoon = expiringSoon, HighConsumption = highConsumption }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Hiba történt: {ex.Message}");
            }
        }
    }
}
