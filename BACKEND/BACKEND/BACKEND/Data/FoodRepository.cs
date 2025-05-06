using BACKEND.Models;
using System.Collections.Generic;

namespace BACKEND.Data
{
    public class FoodRepository : IFoodRepository
    {
        private readonly List<FoodItem> _items = new List<FoodItem>();

        public List<FoodItem> GetAll()
        {
            return _items;
        }

        public List<FoodItem> validItems(List<FoodItem> foodItems)
        {
            return foodItems.Where(f => DateTime.TryParse(f.ExpiryDate, out _)).ToList();
        }

        public void Add(FoodItem item)
        {
            _items.Add(item);
        }

        public void Remove(FoodItem item)
        {
            _items.Remove(item);
        }
    }
}
