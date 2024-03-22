using helpharbour.Model;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

namespace helpharbour.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        

        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }


        [HttpGet]
        public IEnumerable<ticket> Get()
        {
            var client = new MongoClient("mongodb+srv://fa152:@cluster0.ims6w54.mongodb.net/?retryWrites=true&w=majority");
            var database = client.GetDatabase("helpharbourDB");
            var collection = database.GetCollection<ticket>("ticket");

            return collection.Find(ticket => true).ToList();
        }
    }
}