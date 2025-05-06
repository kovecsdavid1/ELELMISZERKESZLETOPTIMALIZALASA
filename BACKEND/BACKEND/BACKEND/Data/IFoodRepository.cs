namespace BACKEND.Data
{
    public interface IFoodRepository
    {
        List<FoodItem> GetAll();
        void Add(FoodItem item);
        void Remove(FoodItem item);
    }
}
