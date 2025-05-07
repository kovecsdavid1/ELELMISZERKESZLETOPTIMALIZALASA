using BACKEND.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace BACKEND.Data
{
    public class FoodRepository : IFoodRepository
    {
        private readonly List<FoodItem> _items = new List<FoodItem>();

        public List<FoodItem> validItems(List<FoodItem> foodItems)
        {
            return foodItems.Where(f => DateTime.TryParse(f.ExpiryDate, out _)).ToList();
        }

        public List<FoodItem> Prioritizer(List<FoodItem> foodItems)
        {
            return foodItems.OrderBy(f => DateTime.Parse(f.ExpiryDate)).ToList();
        }

        public List<FoodItem> ToBuy(List<FoodItem> foodItems)
        {
            return foodItems
                .Where(f => (DateTime.Parse(f.ExpiryDate) - DateTime.Now).Days <= 7)
                .ToList();
        }

        public List<FoodItemConsumption> ConsumptionRates(List<FoodItem> foodItems)
        {
            return foodItems.Select(f =>
            {
                var expiryDate = DateTime.Parse(f.ExpiryDate);
                var daysLeft = (expiryDate - DateTime.Now).Days;
                daysLeft = daysLeft <= 0 ? 1 : daysLeft;
                var rate = Math.Round((f.Quantity / (double)daysLeft) * 30, 2);
                return new FoodItemConsumption { Name = f.Name, Rate = rate };
            }).ToList();
        }
    }

    public class FoodItemConsumption
    {
        public string Name { get; set; }
        public double Rate { get; set; }
    }
}
