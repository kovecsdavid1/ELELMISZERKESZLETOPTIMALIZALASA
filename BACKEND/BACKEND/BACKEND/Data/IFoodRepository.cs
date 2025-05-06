using BACKEND.Models;
using System.Collections.Generic;

namespace BACKEND.Data
{
    public interface IFoodRepository
    {
        List<FoodItem> GetAll();

        public List<FoodItem> validItems(List<FoodItem> foodItems);

        void Add(FoodItem item);
        void Remove(FoodItem item);
    }
}
