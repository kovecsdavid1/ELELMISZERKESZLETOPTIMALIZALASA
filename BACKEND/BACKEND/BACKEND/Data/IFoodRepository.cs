using BACKEND.Models;
using System.Collections.Generic;

namespace BACKEND.Data
{
    public interface IFoodRepository
    {
        List<FoodItem> validItems(List<FoodItem> foodItems);
        List<FoodItem> Prioritizer(List<FoodItem> foodItems);
        List<FoodItemConsumption> ConsumptionRates(List<FoodItem> foodItems);
        List<FoodItem> ToBuy(List<FoodItem> foodItems);
    }
}
