using Microsoft.AspNetCore.Mvc;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FoodItemController : Controller
    {
        [HttpPost]
        public IActionResult OptimizeInventory([FromBody])
        {
            return View();
        }
    }
}
