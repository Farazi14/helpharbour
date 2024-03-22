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
        public IEnumerable<WeatherForecast> Get()
        {
            var client = new MongoClient("mongodb+srv://fa152:<password>@cluster0.ims6w54.mongodb.net/?retryWrites=true&w=majority");
            var database = client.GetDatabase("helpharbourDB");
            var collection = database.GetCollection<BsonDocument>("ticket");
            collection.Find(new BsonDocument()).ToList().ForEach(Console.WriteLine);
            return null;
        }
    }
}